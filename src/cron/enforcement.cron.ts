import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Manager } from '../entities/manager.entity';
import { AbuseService, AbuseAction } from '../abuse/abuse.service';

@Injectable()
export class EnforcementCron {
  private readonly logger = new Logger(EnforcementCron.name);

  constructor(
    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,

    private readonly abuseService: AbuseService,
  ) {}

  /**
   * ⏰ Runs every hour
   * Enforces grace period expiry & suspensions
   */
  @Cron(CronExpression.EVERY_HOUR)
  async enforceBusinessRules() {
    this.logger.log('Running enforcement cron...');

    const now = new Date();

    /**
     * Find managers whose grace period expired
     */
    const overdueManagers = await this.managersRepo.find({
      where: {
        pendingGraceExpiry: LessThan(now),
      },
    });

    for (const manager of overdueManagers) {
      try {
        // Enforce abuse rules centrally
        this.abuseService.assertAllowed(
          manager,
          AbuseAction.ACTIVATE_SUBSCRIBER,
        );
      } catch (err) {
        // Suspend account safely
        manager.isSuspended = true;

        await this.managersRepo.save(manager);

        this.logger.warn(
          `Manager ${manager.id} suspended due to expired grace period`,
        );
      }
    }

    this.logger.log(
      `Enforcement completed. Checked ${overdueManagers.length} managers.`,
    );
  }
}