import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Manager } from '../entities/manager.entity';
import { Subscriber } from '../entities/subscriber.entity';
import { ServiceFeeSummary } from '../entities/service-fee-summary.entity';
import { SystemRevenue } from '../payments/entities/system-revenue.entity';

@Injectable()
export class AdminService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * ======================================================
   * EXISTING METRICS (DO NOT TOUCH)
   * ======================================================
   */
  async getMetrics() {
    const managerRepo = this.dataSource.getRepository(Manager);
    const subscriberRepo =
      this.dataSource.getRepository(Subscriber);
    const feeRepo =
      this.dataSource.getRepository(ServiceFeeSummary);

    const totalManagers = await managerRepo.count();
    const totalSubscribers = await subscriberRepo.count();

    const { sum } = await feeRepo
      .createQueryBuilder('f')
      .select('COALESCE(SUM(f.amount), 0)', 'sum')
      .getRawOne<{ sum: string }>();

    return {
      totalManagers,
      totalSubscribers,
      totalRevenue: Number(sum),
    };
  }

  /**
   * ======================================================
   * SYSTEM SUPPORT REVENUE SUMMARY (IBM)
   * ======================================================
   */
  async getSystemRevenueSummary() {
    const repo =
      this.dataSource.getRepository(SystemRevenue);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = await repo
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.amount), 0)', 'sum')
      .getRawOne<{ sum: string }>();

    const todayRevenue = await repo
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.amount), 0)', 'sum')
      .where('r.createdAt >= :today', { today })
      .getRawOne<{ sum: string }>();

    const monthRevenue = await repo
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.amount), 0)', 'sum')
      .where(
        "DATE_TRUNC('month', r.createdAt) = DATE_TRUNC('month', NOW())",
      )
      .getRawOne<{ sum: string }>();

    return {
      totalSystemRevenue: Number(total.sum),
      todaySystemRevenue: Number(todayRevenue.sum),
      thisMonthSystemRevenue: Number(monthRevenue.sum),
    };
  }

  /**
   * ======================================================
   * MONTHLY SUBSCRIPTION OVERVIEW (FINAL MODEL)
   * ======================================================
   */
  async getMonthlySubscriptionOverview() {
    const repo = this.dataSource.getRepository(Manager);
    const managers = await repo.find();

    const paid = managers.filter(
      (m) => !m.subscriptionDueAt,
    );

    const pending = managers.filter(
      (m) => !!m.subscriptionDueAt,
    );

    const expectedMonthlyRevenue = managers.reduce(
      (sum, m) => {
        if (m.tier === 'TIER_2') return sum + 50000;
        if (m.tier === 'TIER_3') return sum + 150000;
        return sum;
      },
      0,
    );

    return {
      paidManagers: paid.length,
      pendingManagers: pending.length,
      blockedManagers: 0,
      expectedMonthlyRevenue,
    };
  }

  /**
   * ======================================================
   * MANAGER COMPLIANCE TABLE (FINAL MODEL)
   * ======================================================
   */
  async getManagerComplianceTable() {
    const repo = this.dataSource.getRepository(Manager);
    const managers = await repo.find();

    return managers.map((m) => {
      const subscriptionStatus = m.subscriptionDueAt
        ? 'PENDING'
        : 'PAID';

      let actionRequired: string | null = null;

      if (m.isSuspended) {
        actionRequired = 'ADMIN_SUSPENDED';
      } else if (subscriptionStatus === 'PENDING') {
        actionRequired = 'PAY_SUBSCRIPTION';
      }

      return {
        managerId: m.id,
        businessName: m.businessName,
        tier: m.tier,
        subscriptionStatus,
        subscriptionDueAt: m.subscriptionDueAt,
        balance: m.balance,
        isSuspended: m.isSuspended,
        suspensionReason: m.suspensionReason,
        actionRequired,
      };
    });
  }

  /**
   * ======================================================
   * 📊 DAILY SYSTEM REVENUE (CHART)
   * ======================================================
   */
  async getDailyRevenue(days = 30) {
    const rows = await this.dataSource.query(`
      SELECT 
        DATE("createdAt") as date,
        SUM(amount) as total
      FROM system_revenue
      WHERE "createdAt" >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `);

    return rows.map((r) => ({
      date: r.date,
      total: Number(r.total),
    }));
  }

  /**
   * ======================================================
   * 📊 MONTHLY SYSTEM REVENUE (CHART)
   * ======================================================
   */
  async getMonthlyRevenue(months = 12) {
    const rows = await this.dataSource.query(`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        SUM(amount) as total
      FROM system_revenue
      WHERE "createdAt" >= NOW() - INTERVAL '${months} months'
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month ASC
    `);

    return rows.map((r) => ({
      month: r.month,
      total: Number(r.total),
    }));
  }

  /**
   * ======================================================
   * 📁 EXPORT — SYSTEM REVENUE CSV
   * ======================================================
   */
  async exportSystemRevenueCSV() {
    const rows = await this.dataSource.query(`
      SELECT 
        sr."createdAt",
        sr."managerId",
        m."businessName",
        sr.tier,
        sr.amount,
        sr."paymentReference"
      FROM system_revenue sr
      JOIN manager m ON m.id = sr."managerId"
      ORDER BY sr."createdAt" DESC
    `);

    const header = [
      'Date',
      'Manager ID',
      'Business Name',
      'Tier',
      'Amount',
      'Payment Reference',
    ];

    return [
      header.join(','),
      ...rows.map((r) =>
        [
          r.createdAt,
          r.managerId,
          `"${r.businessName}"`,
          r.tier,
          r.amount,
          r.paymentReference || '',
        ].join(','),
      ),
    ].join('\n');
  }

  /**
   * ======================================================
   * ✅ ADMIN — SUSPEND / UNSUSPEND MANAGER
   * ======================================================
   */
  async setManagerSuspension(
    managerId: number,
    suspend: boolean,
    reason?: string,
  ) {
    const repo = this.dataSource.getRepository(Manager);
    const manager = await repo.findOne({ where: { id: managerId } });
    if (!manager) throw new Error('Manager not found');

    manager.isSuspended = suspend;
    manager.suspensionReason = suspend
      ? reason ?? 'Suspended by admin'
      : null;
    manager.suspendedUntil = null;

    await repo.save(manager);

    return {
      managerId: manager.id,
      isSuspended: manager.isSuspended,
      suspensionReason: manager.suspensionReason,
    };
  }

  /**
   * ======================================================
   * ✅ ADMIN — MANUAL SUBSCRIPTION UNBLOCK (FINAL)
   * ======================================================
   */
  async manualUnblockManager(managerId: number) {
    const repo = this.dataSource.getRepository(Manager);
    const manager = await repo.findOne({ where: { id: managerId } });
    if (!manager) throw new Error('Manager not found');

    manager.subscriptionDueAt = null;

    await repo.save(manager);

    return {
      managerId: manager.id,
      subscriptionStatus: 'PAID',
      message: 'Subscription marked as paid by admin',
    };
  }
}
