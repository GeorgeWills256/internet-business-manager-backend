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
        const pgSslMode = (config.get<string>('PGSSLMODE') ?? process.env.PGSSLMODE ?? '').toLowerCase();
        const nodeEnv = (config.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? 'development').toLowerCase();
        const isProd = nodeEnv === 'production';

        const sslOption = (() => {
          // If URL or PGSSLMODE explicitly requires TLS
          if (dbUrl.includes('sslmode=require') || pgSslMode === 'require') {
            return isProd ? { rejectUnauthorized: true } : { rejectUnauthorized: false };
          }

          // Explicitly disable TLS (useful for transaction poolers that don't support SSL)
          if (dbUrl.includes('sslmode=disable') || pgSslMode === 'disable') {
            return false;
          }

          // Allow a 'no-verify' mode to accept self-signed certs (local dev/testing).
          if (pgSslMode === 'no-verify' || pgSslMode === 'disable-verify') {
            return { rejectUnauthorized: false };
          }

          return false;
        })();

        // Safe debug: show DB prefix and ssl choice (mask secrets)
        // Remove or comment out in production.
        const masked = dbUrl ? `${dbUrl.slice(0, 40)}...` : '<not set>';
        // eslint-disable-next-line no-console
        console.log(`DB URL: ${masked}  SSL: ${sslOption ? JSON.stringify(sslOption) : 'false'}`);

        return {
          type: 'postgres',
          url: dbUrl,
          ssl: sslOption,
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
          // pass ssl into extra so pg definitely receives it
          extra: {
            max: 10,
            ...(sslOption ? { ssl: sslOption } : {}),
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
    NotificationModule,
  ],
})
export class AppModule {}
