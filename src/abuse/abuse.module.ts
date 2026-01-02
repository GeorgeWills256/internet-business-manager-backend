import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbuseService } from './abuse.service';
import { Manager } from '../entities/manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manager])],
  providers: [AbuseService],
  exports: [AbuseService],
})
export class AbuseModule {}