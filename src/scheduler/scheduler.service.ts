import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Subscriber } from '../entities/subscriber.entity';
import { Manager } from '../entities/manager.entity';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(Subscriber)
    private readonly subscribersRepo: Repository<Subscriber>,

    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,
  ) {}

  /**
   * Runs every hour
   * - Deactivates expired subscribers
   */
  @Cron(CronExpression.EVERY_HOUR)
  async deactivateExpiredSubscribers() {
    const now = new Date();

    const expiredSubscribers = await this.subscribersRepo.find({
      where: {
        active: true,
        expiryDate: LessThan(now),
      },
      relations: ['manager'],
    });

    if (expiredSubscribers.length === 0) return;

    for (const sub of expiredSubscribers) {
      sub.active = false;
      await this.subscribersRepo.save(sub);

      this.logger.log(
        `Subscriber ${sub.phone} deactivated (expired ${sub.expiryDate})`,
      );
    }
  }

  /**
   * Runs daily at midnight
   * - Adds daily service cost to managers
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async applyDailyServiceFees() {
    const managers = await this.managersRepo.find();

    for (const manager of managers) {
      manager.pendingWeeklyFee += manager.dailyInternetFee || 0;
      await this.managersRepo.save(manager);
    }

    this.logger.log('Daily service fees applied to managers');
  }

  /**
   * Runs weekly (Monday midnight)
   * - Checks unpaid weekly fees
   * - Applies grace period logic
   */
  @Cron(CronExpression.EVERY_WEEK)
  async processWeeklyServiceFees() {
    const now = new Date();
    const managers = await this.managersRepo.find();

    for (const manager of managers) {
      if (manager.pendingWeeklyFee > 0) {
        // Start grace period if not already started
        if (!manager.pendingGraceExpiry) {
          const graceExpiry = new Date();
          graceExpiry.setDate(graceExpiry.getDate() + 3); // 3-day grace

          manager.pendingGraceExpiry = graceExpiry;
          await this.managersRepo.save(manager);

          this.logger.warn(
            `Manager ${manager.id} entered grace period until ${graceExpiry}`,
          );
        }

        // Grace expired → deactivate manager subscribers
        if (
          manager.pendingGraceExpiry &&
          manager.pendingGraceExpiry < now
        ) {
          const subscribers = await this.subscribersRepo.find({
            where: {
              manager: { id: manager.id },
              active: true,
            },
          });

          for (const sub of subscribers) {
            sub.active = false;
            await this.subscribersRepo.save(sub);
          }

          this.logger.error(
            `Manager ${manager.id} grace expired. Subscribers deactivated.`,
          );
        }
      }
    }
  }
}