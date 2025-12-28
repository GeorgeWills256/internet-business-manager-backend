import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from '../entities/manager.entity';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Manager])],
  controllers: [ManagersController],
  providers: [ManagersService],
  exports: [ManagersService],
})
export class ManagersModule {}