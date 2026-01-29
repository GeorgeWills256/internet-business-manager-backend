import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Manager } from '../entities/manager.entity';
import { Subscriber } from '../entities/subscriber.entity';
import { PortalSession } from '../portal/entities/portal-session.entity';
import { ServiceFeeSummary } from '../entities/service-fee-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Manager,
      Subscriber,
      PortalSession,
      ServiceFeeSummary,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
