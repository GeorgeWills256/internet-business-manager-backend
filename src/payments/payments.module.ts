import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

import { Manager } from '../entities/manager.entity';
import { Subscriber } from '../entities/subscriber.entity';
import { ServiceFeeSummary } from '../entities/service-fee-summary.entity';
import { MobileMoneyTransaction } from './entities/mobile-money-transaction.entity';

import { PortalModule } from '../portal/portal.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AbuseModule } from '../abuse/abuse.module';
import { NotificationModule } from '../notifications/notification.module'; // ✅ ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Manager,
      Subscriber,
      ServiceFeeSummary,
      MobileMoneyTransaction,
    ]),

    PortalModule,
    AuditLogsModule,
    AbuseModule,

    NotificationModule, // ✅ REQUIRED for SMS / Email warnings
  ],
  controllers: [
    PaymentsController,
  ],
  providers: [
    PaymentsService,
  ],
})
export class PaymentsModule {}