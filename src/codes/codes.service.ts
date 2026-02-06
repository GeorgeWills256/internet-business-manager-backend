import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Code } from '../entities/code.entity';
import { Manager } from '../entities/manager.entity';
import { SubscribersService } from '../subscribers/subscribers.service';

import {
  AbuseService,
  AbuseAction,
} from '../abuse/abuse.service';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(Code)
    private readonly codesRepo: Repository<Code>,

    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,

    private readonly subscribersService: SubscribersService,
    private readonly abuseService: AbuseService,
  ) {}

  /**
   * 🎟️ GENERATE FREE DAILY CODE
   */
  async generateFreeCode(managerId: number) {
    const manager = await this.managersRepo.findOne({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    /**
     * 🔐 Abuse protection (limits + grace + suspension)
     */
    this.abuseService.assertAllowed(
      manager,
      AbuseAction.ISSUE_FREE_CODE,
    );

    /**
     * 🔁 Reset daily counters if date changed
     */
    const today = new Date().toISOString().slice(0, 10);

    if (manager.freeCodesIssuedDate !== today) {
      manager.freeCodesIssuedDate = today;
      manager.freeCodesIssuedToday = 0;
    }

    /**
     * ➕ Increment counter
     */
    manager.freeCodesIssuedToday += 1;
    await this.managersRepo.save(manager);

    /**
     * 🎫 Create code
     */
    const code = this.codesRepo.create({
      code: this.randomCode(),
      daysGranted: 1,
      isFree: true,
      used: false,
      manager,
    });

    return this.codesRepo.save(code);
  }

  /**
   * 🔓 REDEEM CODE
   */
  async redeemCode(dto: {
    codeValue: string;
    subscriberId: number;
  }) {
    const code = await this.codesRepo.findOne({
      where: { code: dto.codeValue, used: false },
      relations: ['manager'],
    });

    if (!code) {
      throw new BadRequestException(
        'Invalid or already used code',
      );
    }

    /**
     * 🔐 Abuse protection on activation
     */
    this.abuseService.assertAllowed(
      code.manager,
      AbuseAction.ACTIVATE_SUBSCRIBER,
    );

    await this.subscribersService.activate({
      subscriberId: dto.subscriberId,
      days: code.daysGranted,
      source: 'code',
    });

    code.used = true;
    code.usedAt = new Date();

    await this.codesRepo.save(code);

    return {
      ok: true,
      daysGranted: code.daysGranted,
    };
  }

  /**
   * 🔑 Random code generator
   */
  private randomCode(): string {
    // Use a cryptographically secure RNG for code generation
    // 4 bytes -> 8 hex characters (uppercased)
    return randomBytes(4).toString('hex').toUpperCase();
  }
}