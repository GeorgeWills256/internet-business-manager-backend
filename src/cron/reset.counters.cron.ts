import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from '../entities/manager.entity';

@Injectable()
export class ResetCountersCron {
  private readonly logger = new Logger(ResetCountersCron.name);

  constructor(
    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,
  ) {}

  /**
   * ⏰ Runs every midnight
   * Resets daily free code counters
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDailyCounters() {
    await this.managersRepo
      .createQueryBuilder()
      .update()
      .set({
        freeCodesIssuedToday: 0,
        freeCodesIssuedDate: null,
      })
      .execute();

    this.logger.log('Daily free code counters reset');
  }
}