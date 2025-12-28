import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Manager } from '../entities/manager.entity';

@Module({
  imports: [
    /**
     * Passport (JWT strategy support)
     */
    PassportModule.register({ defaultStrategy: 'jwt' }),

    /**
     * JWT configuration
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION',
      signOptions: { expiresIn: '7d' },
    }),

    /**
     * Access Manager entity for auth
     */
    TypeOrmModule.forFeature([Manager]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    PassportModule,
    JwtModule, // 👈 needed for guards in other modules
  ],
})
export class AuthModule {}