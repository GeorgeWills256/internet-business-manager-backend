import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Manager } from '../entities/manager.entity';

export type UserRole = 'admin' | 'manager' | 'salesperson';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user by phone OR username + password
   */
  async validateUser(identifier: string, password: string): Promise<Manager> {
    const manager = await this.managersRepo.findOne({
      where: [{ phone: identifier }, { username: identifier }],
    });

    if (!manager || !manager.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, manager.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return manager;
  }

  /**
   * Login and return JWT
   */
  async login(identifier: string, password: string) {
    const user = await this.validateUser(identifier, password);

    // Determine role cleanly
    let role: UserRole = 'salesperson';
    if (user.isManager) role = 'manager';
    if (user.isAdmin) role = 'admin';

    const payload = {
      sub: user.id,
      role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        role,
        phone: user.phone,
        username: user.username,
      },
    };
  }

  /**
   * Register a manager (admin-only later)
   */
  async registerManager(dto: {
    phone: string;
    username: string;
    password: string;
  }) {
    const exists = await this.managersRepo.findOne({
      where: [{ phone: dto.phone }, { username: dto.username }],
    });

    if (exists) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const manager = this.managersRepo.create({
      phone: dto.phone,
      username: dto.username,
      passwordHash,
      isManager: true,
      isAdmin: false,
    });

    await this.managersRepo.save(manager);

    return {
      ok: true,
      message: 'Manager registered successfully',
      managerId: manager.id,
    };
  }
}