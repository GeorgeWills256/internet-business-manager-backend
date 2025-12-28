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
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscriber_entity_1 = require("../entities/subscriber.entity");
const manager_entity_1 = require("../entities/manager.entity");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    constructor(subscribersRepo, managersRepo) {
        this.subscribersRepo = subscribersRepo;
        this.managersRepo = managersRepo;
        this.logger = new common_1.Logger(SchedulerService_1.name);
    }
    async deactivateExpiredSubscribers() {
        const now = new Date();
        const expiredSubscribers = await this.subscribersRepo.find({
            where: {
                active: true,
                expiryDate: (0, typeorm_2.LessThan)(now),
            },
            relations: ['manager'],
        });
        if (expiredSubscribers.length === 0)
            return;
        for (const sub of expiredSubscribers) {
            sub.active = false;
            await this.subscribersRepo.save(sub);
            this.logger.log(`Subscriber ${sub.phone} deactivated (expired ${sub.expiryDate})`);
        }
    }
    async applyDailyServiceFees() {
        const managers = await this.managersRepo.find();
        for (const manager of managers) {
            manager.pendingWeeklyFee += manager.dailyInternetFee || 0;
            await this.managersRepo.save(manager);
        }
        this.logger.log('Daily service fees applied to managers');
    }
    async processWeeklyServiceFees() {
        const now = new Date();
        const managers = await this.managersRepo.find();
        for (const manager of managers) {
            if (manager.pendingWeeklyFee > 0) {
                if (!manager.pendingGraceExpiry) {
                    const graceExpiry = new Date();
                    graceExpiry.setDate(graceExpiry.getDate() + 3);
                    manager.pendingGraceExpiry = graceExpiry;
                    await this.managersRepo.save(manager);
                    this.logger.warn(`Manager ${manager.id} entered grace period until ${graceExpiry}`);
                }
                if (manager.pendingGraceExpiry &&
                    manager.pendingGraceExpiry < now) {
                    const subscribers = await this.subscribersRepo.find({
                        where: {
                            manager: { id: manager.id },
                            active: true,
                        },
                    });
                    for (const sub of subscribers) {
                        sub.active = false;
                        await this.subscribersRepo.save(sub);
                    }
                    this.logger.error(`Manager ${manager.id} grace expired. Subscribers deactivated.`);
                }
            }
        }
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "deactivateExpiredSubscribers", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "applyDailyServiceFees", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_WEEK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "processWeeklyServiceFees", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __param(1, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map