import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';

/**
 * GLOBAL GUARDS
 */
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

/**
 * ENTITIES (EXPLICIT REGISTRATION — IMPORTANT)
 */
import { Manager } from './entities/manager.entity';
import { Subscriber } from './entities/subscriber.entity';
import { Code } from './entities/code.entity';
import { ServiceFeeSummary } from './entities/service-fee-summary.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  /**
   * CONTROLLERS
   */
  controllers: [HealthController],

  /**
   * MODULE IMPORTS
   */
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
     * DATABASE (SUPABASE POSTGRES)
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },

        /**
         * 🔑 EXPLICIT ENTITY REGISTRATION
         */
        entities: [
          Manager,
          Subscriber,
          Code,
          ServiceFeeSummary,
          AuditLog,
        ],

        synchronize: false,
        logging: false,

        migrations: ['dist/migrations/*.js'],
        migrationsRun: false,

        extra: { max: 10 },
      }),
    }),

    /**
     * AUTHENTICATION & JWT
     */
    AuthModule,

    /**
     * AUDIT LOGGING
     */
    AuditLogsModule,
  ],

  /**
   * GLOBAL GUARDS (STEP B2.4)
   */
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}