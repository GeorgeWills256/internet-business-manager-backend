import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';

import { Manager } from '../entities/manager.entity';
import { Subscriber } from '../entities/subscriber.entity';
import {
  PortalSession,
  PortalSessionStatus,
} from '../portal/entities/portal-session.entity';
import { ServiceFeeSummary } from '../entities/service-fee-summary.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,

    @InjectRepository(Subscriber)
    private readonly subscribersRepo: Repository<Subscriber>,

    @InjectRepository(PortalSession)
    private readonly portalRepo: Repository<PortalSession>,

    @InjectRepository(ServiceFeeSummary)
    private readonly feesRepo: Repository<ServiceFeeSummary>,
  ) {}

  /**
   * =========================
   * TIER → LIVE SESSION LIMIT
   * =========================
   */
  private resolveTierLimit(tier: Manager['tier']): number {
    if (tier === 'TIER_1') return 100;
    if (tier === 'TIER_2') return 300;
    return Infinity;
  }

  /**
   * =========================
   * SUBSCRIPTION BANNER
   * (Derived — FINAL MODEL)
   * =========================
   */
  private buildSubscriptionBanner(manager: Manager) {
    if (!manager.subscriptionDueAt) {
      return { visible: false };
    }

    return {
      visible: true,
      severity: 'warning',
      title: 'Subscription Payment Pending',
      message:
        'Your monthly subscription fee is pending. Please pay to avoid service interruption.',
      dueAt: manager.subscriptionDueAt,
      action: 'PAY_SUBSCRIPTION',
    };
  }

  /**
   * =========================
   * DASHBOARD OVERVIEW
   * =========================
   */
  async getOverview(managerId: number) {
    const manager = await this.managersRepo.findOne({
      where: { id: managerId },
    });
    if (!manager) return null;

    const totalSubscribers = await this.subscribersRepo.count({
      where: { manager: { id: managerId } },
    });

    const activeSubscribers = await this.subscribersRepo.count({
      where: {
        manager: { id: managerId },
        active: true,
        expiryDate: MoreThan(new Date()),
      },
    });

    const liveSessions = await this.portalRepo.count({
      where: {
        managerId,
        status: PortalSessionStatus.ACCESS_GRANTED,
        expiresAt: MoreThan(new Date()),
      },
    });

    const revenue = await this.feesRepo
      .createQueryBuilder('f')
      .select('COALESCE(SUM(f.amount), 0)', 'sum')
      .where('f.managerId = :managerId', { managerId })
      .getRawOne<{ sum: string }>();

    const maxSessions = this.resolveTierLimit(manager.tier);
    const slotsRemaining =
      maxSessions === Infinity
        ? Infinity
        : Math.max(0, maxSessions - liveSessions);

    return {
      businessName: manager.businessName,
      tier: manager.tier,

      walletBalance: manager.balance,
      totalRevenue: Number(revenue.sum),

      totalSubscribers,
      activeSubscribers,

      liveSessions,
      maxSessions,
      slotsRemaining,
      usagePercent:
        maxSessions === Infinity
          ? 0
          : Math.round((liveSessions / maxSessions) * 100),

      /**
       * 🔔 SUBSCRIPTION BANNER
       */
      subscriptionBanner:
        this.buildSubscriptionBanner(manager),
    };
  }

  /**
   * =========================
   * ACTIVE INTERNET SESSIONS
   * =========================
   */
  async getActiveSessions(managerId: number) {
    return this.portalRepo.find({
      where: {
        managerId,
        status: PortalSessionStatus.ACCESS_GRANTED,
        expiresAt: MoreThan(new Date()),
      },
      order: { expiresAt: 'ASC' },
      take: 50,
    });
  }

  /**
   * =========================
   * SUBSCRIBER STATS
   * =========================
   */
  async getSubscriberStats(managerId: number) {
    const expiringSoon = await this.subscribersRepo.count({
      where: {
        manager: { id: managerId },
        expiryDate: MoreThan(new Date()),
      },
    });

    return { expiringSoon };
  }
    /**
   * =========================
   * LEGACY — LIVE SESSIONS
   * (Controller compatibility)
   * =========================
   */
  async getLiveSessions(managerId: number) {
    return this.getActiveSessions(managerId);
  }

  /**
   * =========================
   * LEGACY — SESSION LIMITS
   * (Controller compatibility)
   * =========================
   */
  async getLiveSessionsWithLimits(managerId: number) {
    const manager = await this.managersRepo.findOne({
      where: { id: managerId },
    });
    if (!manager) return null;

    const sessions = await this.portalRepo.count({
      where: {
        managerId,
        status: PortalSessionStatus.ACCESS_GRANTED,
        expiresAt: MoreThan(new Date()),
      },
    });

    const maxSessions = this.resolveTierLimit(manager.tier);

    return {
      tier: manager.tier,
      liveSessions: sessions,
      maxSessions,
      slotsRemaining:
        maxSessions === Infinity
          ? Infinity
          : Math.max(0, maxSessions - sessions),
      upgradeRequired:
        maxSessions !== Infinity &&
        sessions >= maxSessions,
    };
  }

}
