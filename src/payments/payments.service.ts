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

    // ✅ AUDIT LOGGING (non-blocking)
    private readonly auditLogs: AuditLogsService,
  ) {}

  /**
   * PROCESS PAYMENT (MOBILE MONEY OR CASH)
   */
  async processPayment(dto: {
    managerId: number;
    subscriberId?: number;
    days: number;
    method: PaymentMethod;
    mobileReference?: string;
  }) {
    // Validate payment method
    if (!['mobile', 'cash'].includes(dto.method)) {
      throw new BadRequestException('Invalid payment method');
    }

    // Mobile payments must have reference
    if (dto.method === 'mobile' && !dto.mobileReference) {
      throw new BadRequestException('Mobile reference required');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /**
       * VALIDATE MANAGER
       */
      const manager = await queryRunner.manager.findOne(Manager, {
        where: { id: dto.managerId },
      });
      if (!manager) throw new NotFoundException('Manager not found');

      /**
       * 🔐 ABUSE GATE — PAYMENT ACTION
       * (Allows recovery but blocks suspended accounts)
       */
      this.abuseService.assertAllowed(
        manager,
        AbuseAction.RECEIVE_PAYMENT,
      );

      /**
       * NORMALIZE DAYS
       */
      const days = Math.max(1, dto.days || 1);

      /**
       * CALCULATE COSTS
       */
      const amount = manager.dailyInternetFee * days;

      // Admin takes 10%
      const adminFee = Math.round(amount * 0.1);

      // Manager receives 90%
      const managerShare = amount - adminFee;

      /**
       * RECORD ADMIN FEE
       */
      await queryRunner.manager.save(ServiceFeeSummary, {
        managerId: manager.id,
        amount: adminFee,
        createdAt: new Date(),
      });

      /**
       * CREDIT MANAGER WALLET
       */
      manager.balance = (manager.balance ?? 0) + managerShare;
      await queryRunner.manager.save(manager);

      /**
       * ACTIVATE SUBSCRIBER IF PROVIDED
       */
      if (dto.subscriberId) {
        const sub = await queryRunner.manager.findOne(Subscriber, {
          where: { id: dto.subscriberId },
        });

        if (!sub) throw new BadRequestException('Subscriber not found');

        const now = new Date();
        sub.daysPurchased = days;
        sub.expiryDate = new Date(
          now.getTime() + days * 24 * 60 * 60 * 1000,
        );
        sub.active = true;
        sub.manager = manager;

        await queryRunner.manager.save(sub);
      }

      /**
       * WEEKLY FEE AUTO-DEDUCTION
       */
      if (
        manager.pendingWeeklyFee &&
        manager.pendingWeeklyFee > 0 &&
        manager.balance >= manager.pendingWeeklyFee
      ) {
        manager.balance -= manager.pendingWeeklyFee;
        manager.pendingWeeklyFee = 0;
        manager.pendingGraceExpiry = null;

        await queryRunner.manager.save(manager);

        await queryRunner.manager
          .createQueryBuilder()
          .update(Subscriber)
          .set({ active: true })
          .where('managerId = :id', { id: manager.id })
          .execute();
      }

      // ✅ COMMIT TRANSACTION
      await queryRunner.commitTransaction();

      /**
       * AUDIT LOG (POST-COMMIT, NEVER BLOCKING)
       */
      try {
        await this.auditLogs.log(
          'PAYMENT_PROCESSED',
          manager.id,
          {
            amount,
            days,
            method: dto.method,
            subscriberId: dto.subscriberId ?? null,
          },
        );
      } catch (auditError) {
        this.logger.warn(
          `Audit log failed for manager ${manager.id}: ${auditError.message}`,
        );
      }

      this.logger.log(
        `Payment processed: manager=${manager.id}, amount=${amount}, method=${dto.method}`,
      );

      return {
        ok: true,
        days,
        amount,
        adminFee,
        managerShare,
        paymentMethod: dto.method,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Payment failed for manager ${dto.managerId}: ${error.message}`,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
