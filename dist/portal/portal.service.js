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
exports.PortalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const portal_session_entity_1 = require("./entities/portal-session.entity");
const manager_entity_1 = require("../entities/manager.entity");
const system_revenue_entity_1 = require("../payments/entities/system-revenue.entity");
const system_fees_config_1 = require("../payments/system-fees.config");
const TIER_LIMITS = {
    TIER_1: { maxLiveSessions: 100, maxRouters: 1 },
    TIER_2: { maxLiveSessions: 300, maxRouters: 3 },
    TIER_3: { maxLiveSessions: 1000, maxRouters: 10 },
};
const DEVICE_MULTIPLIERS = [
    { devices: 1, multiplier: 1.0 },
    { devices: 2, multiplier: 1.5 },
    { devices: 3, multiplier: 1.8 },
    { devices: 4, multiplier: 2.0 },
];
const PACKAGE_DEFINITIONS = {
    '2h': { label: '2 Hours', days: 1, factor: 0.5 },
    '4h': { label: '4 Hours', days: 1, factor: 0.7 },
    '1d': { label: '1 Day', days: 1, factor: 1.0 },
    '7d': { label: '7 Days', days: 7, factor: 5.0 },
    '30d': { label: '30 Days', days: 30, factor: 20.0 },
};
let PortalService = class PortalService {
    getSession(sessionId) {
        throw new Error('Method not implemented.');
    }
    constructor(portalRepo, managersRepo, systemRevenueRepo) {
        this.portalRepo = portalRepo;
        this.managersRepo = managersRepo;
        this.systemRevenueRepo = systemRevenueRepo;
    }
    async previewPrice(input) {
        const manager = await this.managersRepo.findOne({
            where: { id: input.managerId },
        });
        if (!manager) {
            throw new common_1.NotFoundException('Manager not found');
        }
        const pkg = PACKAGE_DEFINITIONS[input.package];
        if (!pkg) {
            throw new common_1.BadRequestException('Invalid package selected');
        }
        const devices = input.devices >= 1 && input.devices <= 4
            ? input.devices
            : 1;
        const multiplier = DEVICE_MULTIPLIERS.find((d) => d.devices === devices)?.multiplier ?? 1;
        const basePrice = Math.round(manager.dailyInternetFee * pkg.factor);
        const totalAmount = Math.round(basePrice * multiplier);
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
    async preparePayNow(input) {
        const session = await this.portalRepo.findOne({
            where: { id: input.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        const manager = await this.managersRepo.findOne({
            where: { id: session.managerId },
        });
        if (!manager) {
            throw new common_1.NotFoundException('Manager not found');
        }
        const pkg = PACKAGE_DEFINITIONS[input.package];
        if (!pkg) {
            throw new common_1.BadRequestException('Invalid package selected');
        }
        const devices = input.devices >= 1 && input.devices <= 4
            ? input.devices
            : 1;
        const multiplier = DEVICE_MULTIPLIERS.find((d) => d.devices === devices)?.multiplier ?? 1;
        const basePrice = Math.round(manager.dailyInternetFee * pkg.factor);
        const totalAmount = Math.round(basePrice * multiplier);
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
            paymentPayload: {
                managerId: manager.id,
                portalSessionId: session.id,
                days: pkg.days,
            },
        };
    }
    async countLiveSessions(managerId) {
        return this.portalRepo.count({
            where: {
                managerId,
                status: portal_session_entity_1.PortalSessionStatus.ACCESS_GRANTED,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
    }
    async countActiveRouters(managerId) {
        const rows = await this.portalRepo
            .createQueryBuilder('s')
            .select('DISTINCT s.routerId', 'routerId')
            .where('s.managerId = :managerId', { managerId })
            .andWhere('s.routerId IS NOT NULL')
            .getRawMany();
        return rows.length;
    }
    inferAllowedDevices(amountPaid, baseAmount) {
        const ratio = amountPaid / baseAmount;
        const match = DEVICE_MULTIPLIERS
            .slice()
            .reverse()
            .find((d) => ratio >= d.multiplier);
        return match?.devices ?? 1;
    }
    async countActiveDevices(managerId, routerId, paymentReference) {
        return this.portalRepo.count({
            where: {
                managerId,
                routerId,
                paymentReference,
                status: portal_session_entity_1.PortalSessionStatus.ACCESS_GRANTED,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
    }
    async createSession(input) {
        if (!input.managerId || !input.macAddress) {
            throw new common_1.BadRequestException('Missing required fields');
        }
        if (input.routerId) {
            const manager = await this.managersRepo.findOne({
                where: { id: input.managerId },
            });
            if (!manager) {
                throw new common_1.NotFoundException('Manager not found');
            }
            const tierConfig = TIER_LIMITS[manager.tier];
            if (tierConfig.maxRouters !== Infinity &&
                (await this.countActiveRouters(manager.id)) >=
                    tierConfig.maxRouters) {
                throw new common_1.ForbiddenException({
                    code: 'ROUTER_LIMIT_REACHED',
                    message: 'Your plan has reached the maximum number of routers.',
                });
            }
        }
        return this.portalRepo.save(this.portalRepo.create({
            managerId: input.managerId,
            macAddress: input.macAddress.toLowerCase(),
            ipAddress: input.ipAddress,
            routerId: input.routerId,
            status: portal_session_entity_1.PortalSessionStatus.CREATED,
        }));
    }
    async grantAccess(input) {
        const session = await this.portalRepo.findOne({
            where: { id: input.sessionId },
        });
        if (!session)
            throw new common_1.NotFoundException();
        const manager = await this.managersRepo.findOne({
            where: { id: session.managerId },
        });
        if (!manager)
            throw new common_1.NotFoundException();
        if (manager.isSuspended) {
            throw new common_1.ForbiddenException('Subscription expired — service suspended');
        }
        const liveSessions = await this.countLiveSessions(manager.id);
        const maxSessions = TIER_LIMITS[manager.tier].maxLiveSessions;
        if (liveSessions >= maxSessions) {
            throw new common_1.ForbiddenException('Live session limit reached');
        }
        const feeConfig = system_fees_config_1.SYSTEM_SUPPORT_FEES[manager.tier];
        const systemSupportFee = Math.floor((input.amountPaid * feeConfig.percentage) / 100);
        manager.balance +=
            input.amountPaid - systemSupportFee;
        await this.managersRepo.save(manager);
        await this.systemRevenueRepo.save({
            managerId: manager.id,
            amount: systemSupportFee,
            tier: manager.tier,
            paymentReference: input.paymentReference,
        });
        session.status = portal_session_entity_1.PortalSessionStatus.ACCESS_GRANTED;
        session.amountPaid = input.amountPaid;
        session.daysGranted = input.days;
        session.paymentReference = input.paymentReference;
        session.expiresAt = new Date(Date.now() +
            input.days * 24 * 60 * 60 * 1000);
        await this.portalRepo.save(session);
        return { ok: true };
    }
    async checkAccess(macAddress) {
        const session = await this.portalRepo.findOne({
            where: { macAddress: macAddress.toLowerCase() },
            order: { createdAt: 'DESC' },
        });
        if (!session)
            return { allowed: false };
        const manager = await this.managersRepo.findOne({
            where: { id: session.managerId },
        });
        if (manager.isSuspended) {
            return {
                allowed: false,
                reason: 'Subscription expired',
            };
        }
        if (session.status !==
            portal_session_entity_1.PortalSessionStatus.ACCESS_GRANTED) {
            return { allowed: false };
        }
        if (session.expiresAt < new Date()) {
            session.status = portal_session_entity_1.PortalSessionStatus.EXPIRED;
            await this.portalRepo.save(session);
            return { allowed: false };
        }
        if (session.routerId && session.paymentReference) {
            const baseAmount = manager.dailyInternetFee;
            const allowedDevices = this.inferAllowedDevices(session.amountPaid, baseAmount);
            const activeDevices = await this.countActiveDevices(manager.id, session.routerId, session.paymentReference);
            if (activeDevices > allowedDevices) {
                return {
                    allowed: false,
                    reason: 'Device limit reached for this package',
                };
            }
        }
        return {
            allowed: true,
            expiresAt: session.expiresAt,
        };
    }
};
exports.PortalService = PortalService;
exports.PortalService = PortalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(portal_session_entity_1.PortalSession)),
    __param(1, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __param(2, (0, typeorm_1.InjectRepository)(system_revenue_entity_1.SystemRevenue)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PortalService);
//# sourceMappingURL=portal.service.js.map