import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: number;
  role: 'ADMIN' | 'MANAGER' | 'SALES';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'SUPER_SECRET_KEY_CHANGE_IN_PROD',
    });
  }

  /**
   * This method CONTROLS what becomes request.user
   */
  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}