import { Module } from '@nestjs/common';
import { AfricasTalkingModule } from './africas-talking/africas-talking.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ManagersModule } from './managers/managers.module';
import { PaymentsModule } from './payments/payments.module';
import { CodesModule } from './codes/codes.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    AfricasTalkingModule,
    ManagersModule,
    SubscribersModule,
    PaymentsModule,
    CodesModule,
    SchedulerModule,
  ],
})
export class AppModule {}