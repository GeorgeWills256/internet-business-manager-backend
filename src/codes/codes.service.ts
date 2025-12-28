import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Code } from '../entities/code.entity';
import { Manager } from '../entities/manager.entity';
import { SubscribersService } from '../subscribers/subscribers.service';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(Code)
    private readonly codesRepo: Repository<Code>,

    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,

    private readonly subscribersService: SubscribersService,
  ) {}

  /** GENERATE FREE DAILY CODE */
  async generateFreeCode(managerId: number) {
    const manager = await this.managersRepo.findOneBy({ id: managerId });
    if (!manager) throw new NotFoundException('Manager not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const generatedToday = await this.codesRepo.count({
      where: {
        manager: { id: managerId },
        isFree: true,
        createdAt: MoreThan(today),
      },
    });

    if (generatedToday >= manager.dailyFreeCodesLimit) {
      throw new BadRequestException('Daily free code limit reached');
    }

    const code = this.codesRepo.create({
      code: this.randomCode(),
      daysGranted: 1,
      isFree: true,
      used: false,
      manager,
    });

    return this.codesRepo.save(code);
  }

  /** REDEEM CODE */
  async redeemCode(dto: {
    codeValue: string;
    subscriberId: number;
  }) {
    const code = await this.codesRepo.findOne({
      where: { code: dto.codeValue, used: false },
      relations: ['manager'],
    });

    if (!code) {
      throw new BadRequestException('Invalid or already used code');
    }

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

  private randomCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
