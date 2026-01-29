import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from '../entities/manager.entity';
import { ManagersController } from './managers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Manager])],
  controllers: [ManagersController],})
export class ManagersModule {}