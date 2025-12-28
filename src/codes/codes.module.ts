import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code } from '../entities/code.entity';
import { Manager } from '../entities/manager.entity';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { SubscribersModule } from '../subscribers/subscribers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Code, Manager]),
    SubscribersModule,
  ],
  controllers: [CodesController],
  providers: [CodesService],
})
export class CodesModule {}
