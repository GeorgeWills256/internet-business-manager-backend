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

@Module({
  controllers: [HealthController],

  imports: [
    /**
     * ENV CONFIG
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    /**
     * RATE LIMITING
     */
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),

    /**
     * CRON / SCHEDULER (OFFICIAL)
     */
    ScheduleModule.forRoot(),

    /**
     * DATABASE
     */
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
        ],

        synchronize: true,
        logging: false,

        extra: { max: 10 },
      }),
    }),

    /**
     * APPLICATION MODULES
     */
    AuthModule,
    AuditLogsModule,
    AbuseModule,
    AdminModule,
  ],
})
export class AppModule {}