import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { AfricasTalkingModule } from '../africas-talking/africas-talking.module';
import { ManagersModule } from '../managers/managers.module';

@Module({
  imports: [AfricasTalkingModule, ManagersModule],
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}