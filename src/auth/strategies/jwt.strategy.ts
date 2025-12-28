import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: number;
  role: 'admin' | 'manager' | 'salesperson';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION',
    });
  }

  /**
   * This object becomes `req.user`
   */
  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}