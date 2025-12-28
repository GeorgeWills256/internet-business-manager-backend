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
var SubscribersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscriber_entity_1 = require("../entities/subscriber.entity");
const manager_entity_1 = require("../entities/manager.entity");
const africas_talking_service_1 = require("../africas-talking/africas-talking.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let SubscribersService = SubscribersService_1 = class SubscribersService {
    constructor(subscribersRepo, managersRepo, sms, auditLogs) {
        this.subscribersRepo = subscribersRepo;
        this.managersRepo = managersRepo;
        this.sms = sms;
        this.auditLogs = auditLogs;
        this.logger = new common_1.Logger(SubscribersService_1.name);
    }
    async register(dto) {
        const manager = await this.managersRepo.findOneBy({ id: dto.managerId });
        if (!manager) {
            this.logger.warn(`Manager not found: ${dto.managerId}`);
            throw new common_1.NotFoundException('Manager not found');
        }
        const subscriber = this.subscribersRepo.create({
            phone: dto.phone,
            manager,
            active: false,
        });
        this.logger.log(`Registering subscriber ${dto.phone} under manager ${manager.id}`);
        return this.subscribersRepo.save(subscriber);
    }
    async activate(dto) {
        const subscriber = await this.subscribersRepo.findOne({
            where: { id: dto.subscriberId },
            relations: ['manager'],
        });
        if (!subscriber) {
            this.logger.warn(`Subscriber not found: ${dto.subscriberId}`);
            throw new common_1.NotFoundException('Subscriber not found');
        }
        if (dto.days < 1) {
            throw new common_1.BadRequestException('Invalid activation duration');
        }
        const now = new Date();
        const expiry = new Date(now.getTime() + dto.days * 24 * 60 * 60 * 1000);
        subscriber.daysPurchased = dto.days;
        subscriber.expiryDate = expiry;
        subscriber.active = true;
        await this.subscribersRepo.save(subscriber);
        this.logger.log(`Activated subscriber ${subscriber.id} for ${dto.days} day(s) via ${dto.source}`);
        try {
            await this.auditLogs.log('SUBSCRIBER_ACTIVATED', subscriber.manager.id, {
                subscriberId: subscriber.id,
                days: dto.days,
                source: dto.source,
                expiryDate: expiry,
            });
        }
        catch (auditError) {
            this.logger.warn(`Audit log failed for subscriber ${subscriber.id}: ${auditError.message}`);
        }
        try {
            await this.sms.sendSMS(subscriber.phone, `Your internet has been activated for ${dto.days} day(s). Expiry: ${expiry.toISOString()}`);
        }
        catch (err) {
            this.logger.error(`Failed to send SMS to ${subscriber.phone}: ${err.message}`);
        }
        return {
            ok: true,
            subscriberId: subscriber.id,
            expiryDate: expiry,
            source: dto.source,
        };
    }
    async list() {
        return this.subscribersRepo.find({
            relations: ['manager'],
            order: { id: 'DESC' },
        });
    }
};
exports.SubscribersService = SubscribersService;
exports.SubscribersService = SubscribersService = SubscribersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __param(1, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        africas_talking_service_1.AfricasTalkingService,
        audit_logs_service_1.AuditLogsService])
], SubscribersService);
//# sourceMappingURL=subscribers.service.js.map