import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AfricasTalkingModule } from '../africas-talking/africas-talking.module';

@Module({
  imports: [AfricasTalkingModule],
})
export class NotificationModule {}
