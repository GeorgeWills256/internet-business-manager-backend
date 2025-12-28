import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchedulerService } from './scheduler.service';
import { Manager } from '../entities/manager.entity';
import { Subscriber } from '../entities/subscriber.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Manager,
      Subscriber,
    ]),
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}