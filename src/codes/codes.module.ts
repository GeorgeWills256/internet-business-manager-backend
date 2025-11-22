import { Module } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { AfricasTalkingModule } from '../africas-talking/africas-talking.module';
import { ManagersModule } from '../managers/managers.module';
import { SubscribersModule } from '../subscribers/subscribers.module';

@Module({
  imports: [AfricasTalkingModule, ManagersModule, SubscribersModule],
  controllers: [CodesController],
  providers: [CodesService],
  exports: [CodesService],
})
export class CodesModule {}