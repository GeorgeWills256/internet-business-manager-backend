import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Manager } from '../entities/manager.entity';

/**
 * 🔑 STANDARDIZED ROLES (LOWERCASE)
 */
export type UserRole = 'admin' | 'manager' | 'salesperson';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * =========================
   * AUTHENTICATION
   * =========================
   */

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<Manager> {
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
   * =========================
   * LOGIN
   * =========================
   */
  async login(identifier: string, password: string) {
    const user = await this.validateUser(identifier, password);

    /**
     * ✅ ROLE RESOLUTION (ORDER MATTERS)
     */
    let role: UserRole = 'salesperson';
    if (user.isManager) role = 'manager';
    if (user.isAdmin) role = 'admin';

    const payload = {
      sub: user.id,
      role, // ✅ LOWERCASE (CRITICAL FIX)
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        role,
        phone: user.phone,
        username: user.username,
        businessName: user.businessName,
      },
    };
  }

  /**
   * =========================
   * MANAGER REGISTRATION
   * =========================
   */
  async registerManager(dto: {
    phone: string;
    username: string;
    password: string;
    businessName: string;
  }) {
    if (!dto.businessName || !dto.businessName.trim()) {
      throw new BadRequestException('Business name is required');
    }

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
      businessName: dto.businessName.trim(),
      isManager: true,
      isAdmin: false,
    });

    await this.managersRepo.save(manager);

    return {
      ok: true,
      message: 'Manager registered successfully',
      managerId: manager.id,
      businessName: manager.businessName,
    };
  }
}