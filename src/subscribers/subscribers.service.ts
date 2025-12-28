import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../entities/subscriber.entity';
import { Manager } from '../entities/manager.entity';
import { AfricasTalkingService } from '../africas-talking/africas-talking.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class SubscribersService {
  private readonly logger = new Logger(SubscribersService.name);

  constructor(
    @InjectRepository(Subscriber)
    private readonly subscribersRepo: Repository<Subscriber>,

    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,

    private readonly sms: AfricasTalkingService,

    // ✅ AUDIT LOGGING (additive, safe)
    private readonly auditLogs: AuditLogsService,
  ) {}

  /** REGISTER SUBSCRIBER (inactive by default) */
  async register(dto: { phone: string; managerId: number }) {
    const manager = await this.managersRepo.findOneBy({ id: dto.managerId });
    if (!manager) {
      this.logger.warn(`Manager not found: ${dto.managerId}`);
      throw new NotFoundException('Manager not found');
    }

    const subscriber = this.subscribersRepo.create({
      phone: dto.phone,
      manager,
      active: false,
    });

    this.logger.log(
      `Registering subscriber ${dto.phone} under manager ${manager.id}`,
    );

    return this.subscribersRepo.save(subscriber);
  }

  /** ACTIVATE SUBSCRIBER (used by payments or codes) */
  async activate(dto: {
    subscriberId: number;
    days: number;
    source: 'payment' | 'code';
  }) {
    const subscriber = await this.subscribersRepo.findOne({
      where: { id: dto.subscriberId },
      relations: ['manager'],
    });

    if (!subscriber) {
      this.logger.warn(`Subscriber not found: ${dto.subscriberId}`);
      throw new NotFoundException('Subscriber not found');
    }

    if (dto.days < 1) {
      throw new BadRequestException('Invalid activation duration');
    }

    const now = new Date();
    const expiry = new Date(
      now.getTime() + dto.days * 24 * 60 * 60 * 1000,
    );

    subscriber.daysPurchased = dto.days;
    subscriber.expiryDate = expiry;
    subscriber.active = true;

    await this.subscribersRepo.save(subscriber);

    this.logger.log(
      `Activated subscriber ${subscriber.id} for ${dto.days} day(s) via ${dto.source}`,
    );

    // ✅ AUDIT LOG (AFTER SUCCESSFUL ACTIVATION)
    try {
      await this.auditLogs.log(
        'SUBSCRIBER_ACTIVATED',
        subscriber.manager.id,
        {
          subscriberId: subscriber.id,
          days: dto.days,
          source: dto.source,
          expiryDate: expiry,
        },
      );
    } catch (auditError) {
      // Audit failure must NEVER break activation
      this.logger.warn(
        `Audit log failed for subscriber ${subscriber.id}: ${auditError.message}`,
      );
    }

    // Send SMS (fire-and-forget, must NOT block activation)
    try {
      await this.sms.sendSMS(
        subscriber.phone,
        `Your internet has been activated for ${dto.days} day(s). Expiry: ${expiry.toISOString()}`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send SMS to ${subscriber.phone}: ${err.message}`,
      );
    }

    return {
      ok: true,
      subscriberId: subscriber.id,
      expiryDate: expiry,
      source: dto.source,
    };
  }

  /** LIST SUBSCRIBERS */
  async list() {
    return this.subscribersRepo.find({
      relations: ['manager'],
      order: { id: 'DESC' },
    });
  }
}