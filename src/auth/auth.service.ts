import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Replace with DB verification
  async validateUser(username: string, pass: string): Promise<any> {
    if (username === 'admin' && pass === '123456') {
      return { id: 1, username: 'admin' };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}