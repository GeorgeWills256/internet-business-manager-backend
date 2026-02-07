import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

/** CORE MODULES */
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AbuseModule } from './abuse/abuse.module';
import { AdminModule } from './admin/admin.module';
import { PortalModule } from './portal/portal.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationModule } from './notifications/notification.module';

/** CONTROLLERS */
import { HealthController } from './health/health.controller';

/** ENTITIES */
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
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL') ?? '';
        const pgSslMode = (config.get<string>('PGSSLMODE') ?? '').toLowerCase();
        const nodeEnv = (config.get<string>('NODE_ENV') ?? 'development').toLowerCase();
        const isProd = nodeEnv === 'production';

        let ssl: false | { rejectUnauthorized: boolean } = false;

        if (dbUrl.includes('sslmode=require') || pgSslMode === 'require') {
          ssl = { rejectUnauthorized: isProd };
        }

        if (dbUrl.includes('sslmode=disable') || pgSslMode === 'disable') {
          ssl = false;
        }

        if (pgSslMode === 'no-verify') {
          ssl = { rejectUnauthorized: false };
        }

        return {
          type: 'postgres',
          url: dbUrl,
          ssl,
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
          synchronize: false, // ✅ migrations control schema
          logging: false,
          extra: {
            max: 10,
            ...(ssl ? { ssl } : {}),
          },
        };
      },
    }),

    NotificationModule,
    AuthModule,
    AuditLogsModule,
    AbuseModule,
    AdminModule,
    PortalModule,
    DashboardModule,
  ],
})
export class AppModule {}
