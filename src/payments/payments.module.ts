import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SubscribersModule } from '../subscribers/subscribers.module';
import { ManagersModule } from '../managers/managers.module';
import { AfricasTalkingModule } from '../africas-talking/africas-talking.module';

@Module({
  imports: [SubscribersModule, ManagersModule, AfricasTalkingModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}