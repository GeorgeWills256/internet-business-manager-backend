import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { Manager } from '../entities/manager.entity';

@Module({
  imports: [
    /**
     * Passport (JWT strategy support)
     */
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    /**
     * JWT configuration
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_CHANGE_IN_PROD',
      signOptions: {
        expiresIn: '7d',
      },
    }),

    /**
     * Access Manager entity for authentication
     */
    TypeOrmModule.forFeature([Manager]),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy, // 🔑 REQUIRED for request.user population
  ],

  /**
   * Export so other modules (Admin, Payments, etc.)
   * can use JWT guards safely
   */
  exports: [
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}