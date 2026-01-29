import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Manager } from '../entities/manager.entity';
import { AbuseModule } from '../abuse/abuse.module';
import { ResetCountersCron } from './reset.counters.cron';

@Module({
  imports: [
    ScheduleModule.forRoot(),     // ⏰ enables cron jobs
    TypeOrmModule.forFeature([Manager]),
    AbuseModule,
  ],
  providers: [
    ResetCountersCron,            // daily resets
  ],
})
export class CronModule {}