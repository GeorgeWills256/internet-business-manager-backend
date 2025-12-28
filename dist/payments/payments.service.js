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
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(dataSource, managersRepo, subscribersRepo, feeRepo, auditLogs) {
        this.dataSource = dataSource;
        this.managersRepo = managersRepo;
        this.subscribersRepo = subscribersRepo;
        this.feeRepo = feeRepo;
        this.auditLogs = auditLogs;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async processPayment(dto) {
        if (!['mobile', 'cash'].includes(dto.method)) {
            throw new common_1.BadRequestException('Invalid payment method');
        }
        if (dto.method === 'mobile' && !dto.mobileReference) {
            throw new common_1.BadRequestException('Mobile reference required');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const manager = await queryRunner.manager.findOne(manager_entity_1.Manager, {
                where: { id: dto.managerId },
            });
            if (!manager)
                throw new common_1.NotFoundException('Manager not found');
            const days = Math.max(1, dto.days || 1);
            const amount = manager.dailyInternetFee * days;
            const adminFee = Math.round(amount * 0.1);
            const managerShare = amount - adminFee;
            await queryRunner.manager.save(service_fee_summary_entity_1.ServiceFeeSummary, {
                managerId: manager.id,
                amount: adminFee,
                createdAt: new Date(),
            });
            manager.balance = (manager.balance ?? 0) + managerShare;
            await queryRunner.manager.save(manager);
            if (dto.subscriberId) {
                const sub = await queryRunner.manager.findOne(subscriber_entity_1.Subscriber, {
                    where: { id: dto.subscriberId },
                });
                if (!sub)
                    throw new common_1.BadRequestException('Subscriber not found');
                const now = new Date();
                sub.daysPurchased = days;
                sub.expiryDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                sub.active = true;
                sub.manager = manager;
                await queryRunner.manager.save(sub);
            }
            if (manager.pendingWeeklyFee &&
                manager.pendingWeeklyFee > 0 &&
                manager.balance >= manager.pendingWeeklyFee) {
                manager.balance -= manager.pendingWeeklyFee;
                manager.pendingWeeklyFee = 0;
                manager.pendingGraceExpiry = null;
                await queryRunner.manager.save(manager);
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(subscriber_entity_1.Subscriber)
                    .set({ active: true })
                    .where('managerId = :id', { id: manager.id })
                    .execute();
            }
            await queryRunner.commitTransaction();
            try {
                await this.auditLogs.log('PAYMENT_PROCESSED', manager.id, {
                    amount,
                    days,
                    method: dto.method,
                    subscriberId: dto.subscriberId ?? null,
                });
            }
            catch (auditError) {
                this.logger.warn(`Audit log failed for manager ${manager.id}: ${auditError.message}`);
            }
            this.logger.log(`Payment processed: manager=${manager.id}, amount=${amount}, method=${dto.method}`);
            return {
                ok: true,
                days,
                amount,
                adminFee,
                managerShare,
                paymentMethod: dto.method,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Payment failed for manager ${dto.managerId}: ${error.message}`);
            throw error;
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
        audit_logs_service_1.AuditLogsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map