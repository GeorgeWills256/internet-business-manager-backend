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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
const subscriber_entity_1 = require("../entities/subscriber.entity");
const portal_session_entity_1 = require("../portal/entities/portal-session.entity");
const service_fee_summary_entity_1 = require("../entities/service-fee-summary.entity");
let DashboardService = class DashboardService {
    constructor(managersRepo, subscribersRepo, portalRepo, feesRepo) {
        this.managersRepo = managersRepo;
        this.subscribersRepo = subscribersRepo;
        this.portalRepo = portalRepo;
        this.feesRepo = feesRepo;
    }
    resolveTierLimit(tier) {
        if (tier === 'TIER_1')
            return 100;
        if (tier === 'TIER_2')
            return 300;
        return Infinity;
    }
    buildSubscriptionBanner(manager) {
        if (!manager.subscriptionDueAt) {
            return { visible: false };
        }
        return {
            visible: true,
            severity: 'warning',
            title: 'Subscription Payment Pending',
            message: 'Your monthly subscription fee is pending. Please pay to avoid service interruption.',
            dueAt: manager.subscriptionDueAt,
            action: 'PAY_SUBSCRIPTION',
        };
    }
    async getOverview(managerId) {
        const manager = await this.managersRepo.findOne({
            where: { id: managerId },
        });
        if (!manager)
            return null;
        const totalSubscribers = await this.subscribersRepo.count({
            where: { manager: { id: managerId } },
        });
        const activeSubscribers = await this.subscribersRepo.count({
            where: {
                manager: { id: managerId },
                active: true,
                expiryDate: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        const liveSessions = await this.portalRepo.count({
            where: {
                managerId,
                status: portal_session_entity_1.PortalSessionStatus.ACCESS_GRANTED,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        const revenue = await this.feesRepo
            .createQueryBuilder('f')
            .select('COALESCE(SUM(f.amount), 0)', 'sum')
            .where('f.managerId = :managerId', { managerId })
            .getRawOne();
        const maxSessions = this.resolveTierLimit(manager.tier);
        const slotsRemaining = maxSessions === Infinity
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
            usagePercent: maxSessions === Infinity
                ? 0
                : Math.round((liveSessions / maxSessions) * 100),
            subscriptionBanner: this.buildSubscriptionBanner(manager),
        };
    }
    async getActiveSessions(managerId) {
        return this.portalRepo.find({
            where: {
                managerId,
                status: portal_session_entity_1.PortalSessionStatus.ACCESS_GRANTED,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
            order: { expiresAt: 'ASC' },
            take: 50,
        });
    }
    async getSubscriberStats(managerId) {
        const expiringSoon = await this.subscribersRepo.count({
            where: {
                manager: { id: managerId },
                expiryDate: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        return { expiringSoon };
    }
    async getLiveSessions(managerId) {
        return this.getActiveSessions(managerId);
    }
    async getLiveSessionsWithLimits(managerId) {
        const manager = await this.managersRepo.findOne({
            where: { id: managerId },
        });
        if (!manager)
            return null;
        const sessions = await this.portalRepo.count({
            where: {
                managerId,
                status: portal_session_entity_1.PortalSessionStatus.ACCESS_GRANTED,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        const maxSessions = this.resolveTierLimit(manager.tier);
        return {
            tier: manager.tier,
            liveSessions: sessions,
            maxSessions,
            slotsRemaining: maxSessions === Infinity
                ? Infinity
                : Math.max(0, maxSessions - sessions),
            upgradeRequired: maxSessions !== Infinity &&
                sessions >= maxSessions,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __param(1, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __param(2, (0, typeorm_1.InjectRepository)(portal_session_entity_1.PortalSession)),
    __param(3, (0, typeorm_1.InjectRepository)(service_fee_summary_entity_1.ServiceFeeSummary)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map