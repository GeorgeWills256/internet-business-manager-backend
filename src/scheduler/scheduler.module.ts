import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ManagersModule } from '../managers/managers.module';
import { SubscribersModule } from '../subscribers/subscribers.module';
import { CodesModule } from '../codes/codes.module';

@Module({
  imports: [ManagersModule, SubscribersModule, CodesModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}