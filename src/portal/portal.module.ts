import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PortalController } from './portal.controller';
import { PortalService } from './portal.service';
import { PortalExpiryCron } from './portal.cron';

import { PortalSession } from './entities/portal-session.entity';
import { Subscriber } from '../entities/subscriber.entity';
import { Manager } from '../entities/manager.entity';
import { SystemRevenue } from '../payments/entities/system-revenue.entity'; // ✅ ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PortalSession,
      Subscriber,     // portal ↔ subscriber
      Manager,        // manager config, tier, branding
      SystemRevenue,  // ✅ REQUIRED for immediate system fee split
    ]),
  ],
  controllers: [PortalController],
  providers: [
    PortalService,
    PortalExpiryCron,
  ],
  exports: [
    PortalService,
  ],
})
export class PortalModule {}