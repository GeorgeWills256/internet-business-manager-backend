"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
const subscriber_entity_1 = require("../entities/subscriber.entity");
const service_fee_summary_entity_1 = require("../entities/service-fee-summary.entity");
const system_revenue_entity_1 = require("../payments/entities/system-revenue.entity");
let AdminService = class AdminService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getMetrics() {
        const managerRepo = this.dataSource.getRepository(manager_entity_1.Manager);
        const subscriberRepo = this.dataSource.getRepository(subscriber_entity_1.Subscriber);
        const feeRepo = this.dataSource.getRepository(service_fee_summary_entity_1.ServiceFeeSummary);
        const totalManagers = await managerRepo.count();
        const totalSubscribers = await subscriberRepo.count();
        const { sum } = await feeRepo
            .createQueryBuilder('f')
            .select('COALESCE(SUM(f.amount), 0)', 'sum')
            .getRawOne();
        return {
            totalManagers,
            totalSubscribers,
            totalRevenue: Number(sum),
        };
    }
    async getSystemRevenueSummary() {
        const repo = this.dataSource.getRepository(system_revenue_entity_1.SystemRevenue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const total = await repo
            .createQueryBuilder('r')
            .select('COALESCE(SUM(r.amount), 0)', 'sum')
            .getRawOne();
        const todayRevenue = await repo
            .createQueryBuilder('r')
            .select('COALESCE(SUM(r.amount), 0)', 'sum')
            .where('r.createdAt >= :today', { today })
            .getRawOne();
        const monthRevenue = await repo
            .createQueryBuilder('r')
            .select('COALESCE(SUM(r.amount), 0)', 'sum')
            .where("DATE_TRUNC('month', r.createdAt) = DATE_TRUNC('month', NOW())")
            .getRawOne();
        return {
            totalSystemRevenue: Number(total.sum),
            todaySystemRevenue: Number(todayRevenue.sum),
            thisMonthSystemRevenue: Number(monthRevenue.sum),
        };
    }
    async getMonthlySubscriptionOverview() {
        const repo = this.dataSource.getRepository(manager_entity_1.Manager);
        const managers = await repo.find();
        const paid = managers.filter((m) => !m.subscriptionDueAt);
        const pending = managers.filter((m) => !!m.subscriptionDueAt);
        const expectedMonthlyRevenue = managers.reduce((sum, m) => {
            if (m.tier === 'TIER_2')
                return sum + 50000;
            if (m.tier === 'TIER_3')
                return sum + 150000;
            return sum;
        }, 0);
        return {
            paidManagers: paid.length,
            pendingManagers: pending.length,
            blockedManagers: 0,
            expectedMonthlyRevenue,
        };
    }
    async getManagerComplianceTable() {
        const repo = this.dataSource.getRepository(manager_entity_1.Manager);
        const managers = await repo.find();
        return managers.map((m) => {
            const subscriptionStatus = m.subscriptionDueAt
                ? 'PENDING'
                : 'PAID';
            return {
                managerId: m.id,
                businessName: m.businessName,
                tier: m.tier,
                subscriptionStatus,
                subscriptionDueAt: m.subscriptionDueAt,
                balance: m.balance,
                isSuspended: m.isSuspended,
                suspensionReason: m.suspensionReason,
                actionRequired: m.isSuspended
                    ? 'ADMIN_SUSPENDED'
                    : subscriptionStatus === 'PENDING'
                        ? 'PAY_SUBSCRIPTION'
                        : null,
            };
        });
    }
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
            ...rows.map((r) => [
                r.createdAt,
                r.managerId,
                `"${r.businessName}"`,
                r.tier,
                r.amount,
                r.paymentReference || '',
            ].join(',')),
        ].join('\n');
    }
    async setManagerSuspension(managerId, suspend, reason) {
        const repo = this.dataSource.getRepository(manager_entity_1.Manager);
        const manager = await repo.findOne({ where: { id: managerId } });
        if (!manager)
            throw new Error('Manager not found');
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
    async manualUnblockManager(managerId) {
        const repo = this.dataSource.getRepository(manager_entity_1.Manager);
        const manager = await repo.findOne({ where: { id: managerId } });
        if (!manager)
            throw new Error('Manager not found');
        manager.subscriptionDueAt = null;
        await repo.save(manager);
        return {
            managerId: manager.id,
            subscriptionStatus: 'PAID',
            message: 'Subscription marked as paid by admin',
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AdminService);
//# sourceMappingURL=admin.service.js.map