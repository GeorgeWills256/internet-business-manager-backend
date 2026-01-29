import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Manager } from '../entities/manager.entity';
import { Subscriber } from '../entities/subscriber.entity';
import { ServiceFeeSummary } from '../entities/service-fee-summary.entity';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import {
  AbuseService,
  AbuseAction,
} from '../abuse/abuse.service';
import { PortalService } from '../portal/portal.service';

export type PaymentMethod = 'mobile' | 'cash';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,

    @InjectRepository(Subscriber)
    private readonly subscribersRepo: Repository<Subscriber>,

    @InjectRepository(ServiceFeeSummary)
    private readonly feeRepo: Repository<ServiceFeeSummary>,

    private readonly abuseService: AbuseService,
    private readonly portalService: PortalService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async processPayment(dto: {
    managerId: number;
    subscriberId?: number;
    portalSessionId?: string;
    days: number;
    amount: number;
    method: PaymentMethod;
    mobileReference?: string;
  }) {
    if (!['mobile', 'cash'].includes(dto.method)) {
      throw new BadRequestException('Invalid method');
    }

    const queryRunner =
      this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager =
        await queryRunner.manager.findOne(Manager, {
          where: { id: dto.managerId },
        });
      if (!manager) throw new NotFoundException();

      this.abuseService.assertAllowed(
        manager,
        AbuseAction.RECEIVE_PAYMENT,
      );

      const adminFee = Math.round(dto.amount * 0.1);
      const managerShare = dto.amount - adminFee;

      await queryRunner.manager.save(ServiceFeeSummary, {
        managerId: manager.id,
        amount: adminFee,
        createdAt: new Date(),
      });

      manager.balance += managerShare;
      await queryRunner.manager.save(manager);

      if (dto.subscriberId) {
        const sub =
          await queryRunner.manager.findOne(
            Subscriber,
            { where: { id: dto.subscriberId } },
          );
        if (!sub) throw new BadRequestException();

        sub.active = true;
        sub.expiryDate = new Date(
          Date.now() +
            dto.days * 24 * 60 * 60 * 1000,
        );
        await queryRunner.manager.save(sub);
      }

      await queryRunner.commitTransaction();

      if (dto.portalSessionId) {
        await this.portalService.grantAccess({
          sessionId: dto.portalSessionId,
          days: dto.days,
          amountPaid: dto.amount,
          paymentReference: dto.mobileReference,
        });
      }

      await this.auditLogs.log(
        'PAYMENT_PROCESSED',
        manager.id,
        dto,
      );

      return { ok: true };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
