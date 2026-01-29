import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

/**
 * CORE MODULES
 */
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AbuseModule } from './abuse/abuse.module';
import { AdminModule } from './admin/admin.module';
import { PortalModule } from './portal/portal.module';
import { DashboardModule } from './dashboard/dashboard.module';

/**
 * CONTROLLERS
 */
import { HealthController } from './health/health.controller';

/**
 * ENTITIES
 */
import { Manager } from './entities/manager.entity';
import { Subscriber } from './entities/subscriber.entity';
import { Code } from './entities/code.entity';
import { ServiceFeeSummary } from './entities/service-fee-summary.entity';
import { AuditLog } from './entities/audit-log.entity';
import { PortalSession } from './portal/entities/portal-session.entity';
import { MobileMoneyTransaction } from './payments/entities/mobile-money-transaction.entity';
import { SystemRevenue } from './entities/system-revenue.entity';

@Module({
  controllers: [HealthController],

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },

        entities: [
          Manager,
          Subscriber,
          Code,
          ServiceFeeSummary,
          AuditLog,
          PortalSession,
          MobileMoneyTransaction,
          SystemRevenue,
        ],

        synchronize: true,
        logging: false,
        extra: { max: 10 },
      }),
    }),

    AuthModule,
    AuditLogsModule,
    AbuseModule,
    AdminModule,
    PortalModule,
    DashboardModule,
  ],
})
export class AppModule {}
