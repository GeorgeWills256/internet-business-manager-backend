import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from '../entities/subscriber.entity';
import { Manager } from '../entities/manager.entity';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { AfricasTalkingModule } from '../africas-talking/africas-talking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber, Manager]),
    AfricasTalkingModule,
  ],
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}
