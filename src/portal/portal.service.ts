import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';

import {
  PortalSession,
  PortalSessionStatus,
} from './entities/portal-session.entity';
import { Manager } from '../entities/manager.entity';
import { SystemRevenue } from '../payments/entities/system-revenue.entity';
import { SYSTEM_SUPPORT_FEES } from '../payments/system-fees.config';

/**
 * =========================
 * TIER LIMIT DEFINITIONS
 * =========================
 */
const TIER_LIMITS = {
  TIER_1: { maxLiveSessions: 100, maxRouters: 1 },
  TIER_2: { maxLiveSessions: 300, maxRouters: 3 },
  TIER_3: { maxLiveSessions: 1000, maxRouters: 10},
} as const;

/**
 * =========================
 * DEVICE MULTIPLIERS
 * =========================
 */
const DEVICE_MULTIPLIERS = [
  { devices: 1, multiplier: 1 },
  { devices: 2, multiplier: 1.5 },
  { devices: 3, multiplier: 1.8 },
  { devices: 4, multiplier: 2 },
];

/**
 * =========================
 * PACKAGE DEFINITIONS
 * =========================
 */
const PACKAGE_DEFINITIONS: Record<
  string,
  { label: string; days: number; factor: number }
> = {
  '2h': { label: '2 Hours', days: 1, factor: 0.5 },
  '4h': { label: '4 Hours', days: 1, factor: 0.7 },
  '1d': { label: '1 Day', days: 1, factor: 1 },
  '7d': { label: '7 Days', days: 7, factor: 5 },
  '30d': { label: '30 Days', days: 30, factor: 20 },
};

@Injectable()
export class PortalService {
  getSession(sessionId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(PortalSession)
    private readonly portalRepo: Repository<PortalSession>,

    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,

    @InjectRepository(SystemRevenue)
    private readonly systemRevenueRepo: Repository<SystemRevenue>,
  ) {}

  /* =====================================================
     PRICE PREVIEW (PUBLIC — NO SIDE EFFECTS)
     ===================================================== */
  async previewPrice(input: {
    managerId: number;
    package: string;
    devices: number;
  }) {
    const manager = await this.managersRepo.findOne({
      where: { id: input.managerId },
    });
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    const pkg = PACKAGE_DEFINITIONS[input.package];
    if (!pkg) {
      throw new BadRequestException(
        'Invalid package selected',
      );
    }

    const devices =
      input.devices >= 1 && input.devices <= 4
        ? input.devices
        : 1;

    const multiplier =
      DEVICE_MULTIPLIERS.find(
        (d) => d.devices === devices,
      )?.multiplier ?? 1;

    const basePrice = Math.round(
      manager.dailyInternetFee * pkg.factor,
    );

    const totalAmount = Math.round(
      basePrice * multiplier,
    );

    return {
      currency: 'UGX',

      package: pkg.label,
      durationDays: pkg.days,

      devices,
      deviceMultiplier: multiplier,

      basePrice,
      deviceAdjustment: totalAmount - basePrice,

      totalPayable: totalAmount,
    };
  }

  /* =====================================================
     💳 PAY-NOW DEEP LINK (PREPARE ONLY)
     ===================================================== */
  async preparePayNow(input: {
    sessionId: string;
    package: string;
    devices: number;
  }) {
    const session = await this.portalRepo.findOne({
      where: { id: input.sessionId },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const manager = await this.managersRepo.findOne({
      where: { id: session.managerId },
    });
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    const pkg = PACKAGE_DEFINITIONS[input.package];
    if (!pkg) {
      throw new BadRequestException(
        'Invalid package selected',
      );
    }

    const devices =
      input.devices >= 1 && input.devices <= 4
        ? input.devices
        : 1;

    const multiplier =
      DEVICE_MULTIPLIERS.find(
        (d) => d.devices === devices,
      )?.multiplier ?? 1;

    const basePrice = Math.round(
      manager.dailyInternetFee * pkg.factor,
    );

    const totalAmount = Math.round(
      basePrice * multiplier,
    );

    return {
      sessionId: session.id,
      managerId: manager.id,
      currency: 'UGX',

      package: pkg.label,
      durationDays: pkg.days,

      devices,
      deviceMultiplier: multiplier,
      basePrice,
      deviceAdjustment: totalAmount - basePrice,

      totalPayable: totalAmount,

      /**
       * FRONTEND SENDS THIS TO /payments/process
       * (Backend recalculates price)
       */
      paymentPayload: {
        managerId: manager.id,
        portalSessionId: session.id,
        days: pkg.days,
      },
    };
  }

  /* =====================================================
     EXISTING CODE — UNCHANGED
     ===================================================== */

  private async countLiveSessions(
    managerId: number,
  ): Promise<number> {
    return this.portalRepo.count({
      where: {
        managerId,
        status: PortalSessionStatus.ACCESS_GRANTED,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  private async countActiveRouters(
    managerId: number,
  ): Promise<number> {
    const rows = await this.portalRepo
      .createQueryBuilder('s')
      .select('DISTINCT s.routerId', 'routerId')
      .where('s.managerId = :managerId', { managerId })
      .andWhere('s.routerId IS NOT NULL')
      .getRawMany();

    return rows.length;
  }

  private inferAllowedDevices(
    amountPaid: number,
    baseAmount: number,
  ): number {
    const ratio = amountPaid / baseAmount;
    const match = DEVICE_MULTIPLIERS
      .slice()
      .reverse()
      .find((d) => ratio >= d.multiplier);
    return match?.devices ?? 1;
  }

  private async countActiveDevices(
    managerId: number,
    routerId: string,
    paymentReference?: string,
  ): Promise<number> {
    return this.portalRepo.count({
      where: {
        managerId,
        routerId,
        paymentReference,
        status: PortalSessionStatus.ACCESS_GRANTED,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async createSession(input: {
    managerId: number;
    macAddress: string;
    ipAddress?: string;
    routerId?: string;
  }) {
    if (!input.managerId || !input.macAddress) {
      throw new BadRequestException('Missing required fields');
    }

    if (input.routerId) {
      const manager = await this.managersRepo.findOne({
        where: { id: input.managerId },
      });

      if (!manager) {
        throw new NotFoundException('Manager not found');
      }

      const tierConfig = TIER_LIMITS[manager.tier];
      if (
        tierConfig.maxRouters !== Infinity &&
        (await this.countActiveRouters(manager.id)) >=
          tierConfig.maxRouters
      ) {
        throw new ForbiddenException({
          code: 'ROUTER_LIMIT_REACHED',
          message:
            'Your plan has reached the maximum number of routers.',
        });
      }
    }

    return this.portalRepo.save(
      this.portalRepo.create({
        managerId: input.managerId,
        macAddress: input.macAddress.toLowerCase(),
        ipAddress: input.ipAddress,
        routerId: input.routerId,
        status: PortalSessionStatus.CREATED,
      }),
    );
  }

  async grantAccess(input: {
    sessionId: string;
    days: number;
    amountPaid: number;
    paymentReference?: string;
  }) {
    const session = await this.portalRepo.findOne({
      where: { id: input.sessionId },
    });
    if (!session) throw new NotFoundException();

    const manager = await this.managersRepo.findOne({
      where: { id: session.managerId },
    });
    if (!manager) throw new NotFoundException();

    /** ✅ FIX #1 */
    if (manager.isSuspended) {
      throw new ForbiddenException(
        'Subscription expired — service suspended',
      );
    }

    const liveSessions =
      await this.countLiveSessions(manager.id);

    const maxSessions =
      TIER_LIMITS[manager.tier].maxLiveSessions;

    if (liveSessions >= maxSessions) {
      throw new ForbiddenException(
        'Live session limit reached',
      );
    }

    const feeConfig = SYSTEM_SUPPORT_FEES[manager.tier];
    const systemSupportFee = Math.floor(
      (input.amountPaid * feeConfig.percentage) / 100,
    );

    manager.balance +=
      input.amountPaid - systemSupportFee;
    await this.managersRepo.save(manager);

    await this.systemRevenueRepo.save({
      managerId: manager.id,
      amount: systemSupportFee,
      tier: manager.tier,
      paymentReference: input.paymentReference,
    });

    session.status = PortalSessionStatus.ACCESS_GRANTED;
    session.amountPaid = input.amountPaid;
    session.daysGranted = input.days;
    session.paymentReference = input.paymentReference;
    session.expiresAt = new Date(
      Date.now() +
        input.days * 24 * 60 * 60 * 1000,
    );

    await this.portalRepo.save(session);

    return { ok: true };
  }

  async checkAccess(macAddress: string) {
    const session = await this.portalRepo.findOne({
      where: { macAddress: macAddress.toLowerCase() },
      order: { createdAt: 'DESC' },
    });

    if (!session) return { allowed: false };

    const manager = await this.managersRepo.findOne({
      where: { id: session.managerId },
    });

    /** ✅ FIX #2 */
    if (manager.isSuspended) {
      return {
        allowed: false,
        reason: 'Subscription expired',
      };
    }

    if (
      session.status !==
      PortalSessionStatus.ACCESS_GRANTED
    ) {
      return { allowed: false };
    }

    if (session.expiresAt < new Date()) {
      session.status = PortalSessionStatus.EXPIRED;
      await this.portalRepo.save(session);
      return { allowed: false };
    }

    if (session.routerId && session.paymentReference) {
      const baseAmount = manager.dailyInternetFee;
      const allowedDevices =
        this.inferAllowedDevices(
          session.amountPaid,
          baseAmount,
        );

      const activeDevices =
        await this.countActiveDevices(
          manager.id,
          session.routerId,
          session.paymentReference,
        );

      if (activeDevices > allowedDevices) {
        return {
          allowed: false,
          reason:
            'Device limit reached for this package',
        };
      }
    }

    return {
      allowed: true,
      expiresAt: session.expiresAt,
    };
  }
}
