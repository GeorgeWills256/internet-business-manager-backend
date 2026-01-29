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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
const subscriber_entity_1 = require("../entities/subscriber.entity");
const service_fee_summary_entity_1 = require("../entities/service-fee-summary.entity");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const abuse_service_1 = require("../abuse/abuse.service");
const portal_service_1 = require("../portal/portal.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(dataSource, managersRepo, subscribersRepo, feeRepo, abuseService, portalService, auditLogs) {
        this.dataSource = dataSource;
        this.managersRepo = managersRepo;
        this.subscribersRepo = subscribersRepo;
        this.feeRepo = feeRepo;
        this.abuseService = abuseService;
        this.portalService = portalService;
        this.auditLogs = auditLogs;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async processPayment(dto) {
        if (!['mobile', 'cash'].includes(dto.method)) {
            throw new common_1.BadRequestException('Invalid method');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const manager = await queryRunner.manager.findOne(manager_entity_1.Manager, {
                where: { id: dto.managerId },
            });
            if (!manager)
                throw new common_1.NotFoundException();
            this.abuseService.assertAllowed(manager, abuse_service_1.AbuseAction.RECEIVE_PAYMENT);
            const adminFee = Math.round(dto.amount * 0.1);
            const managerShare = dto.amount - adminFee;
            await queryRunner.manager.save(service_fee_summary_entity_1.ServiceFeeSummary, {
                managerId: manager.id,
                amount: adminFee,
                createdAt: new Date(),
            });
            manager.balance += managerShare;
            await queryRunner.manager.save(manager);
            if (dto.subscriberId) {
                const sub = await queryRunner.manager.findOne(subscriber_entity_1.Subscriber, { where: { id: dto.subscriberId } });
                if (!sub)
                    throw new common_1.BadRequestException();
                sub.active = true;
                sub.expiryDate = new Date(Date.now() +
                    dto.days * 24 * 60 * 60 * 1000);
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
            await this.auditLogs.log('PAYMENT_PROCESSED', manager.id, dto);
            return { ok: true };
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __param(2, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __param(3, (0, typeorm_1.InjectRepository)(service_fee_summary_entity_1.ServiceFeeSummary)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        abuse_service_1.AbuseService,
        portal_service_1.PortalService,
        audit_logs_service_1.AuditLogsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map