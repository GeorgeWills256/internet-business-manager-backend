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
var MonthlySubscriptionCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlySubscriptionCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
const monthly_subscription_config_1 = require("./monthly-subscription.config");
let MonthlySubscriptionCron = MonthlySubscriptionCron_1 = class MonthlySubscriptionCron {
    constructor(managersRepo) {
        this.managersRepo = managersRepo;
        this.logger = new common_1.Logger(MonthlySubscriptionCron_1.name);
    }
    async handleMonthlySubscriptionDebit() {
        this.logger.log('Running monthly subscription debit job');
        const managers = await this.managersRepo.find();
        const now = new Date();
        for (const manager of managers) {
            const tierConfig = monthly_subscription_config_1.MONTHLY_SUBSCRIPTION_CONFIG[manager.tier];
            const monthlyFee = tierConfig.monthlyFee;
            if (monthlyFee <= 0) {
                manager.monthlySubscriptionDueAt = null;
                manager.monthlySubscriptionGraceUntil = null;
                manager.isSubscriptionBlocked = false;
                await this.managersRepo.save(manager);
                continue;
            }
            if (manager.balance >= monthlyFee) {
                manager.balance -= monthlyFee;
                manager.monthlySubscriptionDueAt = null;
                manager.monthlySubscriptionGraceUntil = null;
                manager.isSubscriptionBlocked = false;
                await this.managersRepo.save(manager);
                this.logger.log(`Monthly subscription paid for manager ${manager.id}`);
                continue;
            }
            const graceUntil = new Date();
            graceUntil.setDate(graceUntil.getDate() + tierConfig.graceDays);
            manager.monthlySubscriptionDueAt = now;
            manager.monthlySubscriptionGraceUntil = graceUntil;
            manager.isSubscriptionBlocked = false;
            await this.managersRepo.save(manager);
            this.logger.warn(`Manager ${manager.id} entered subscription grace period`);
        }
    }
};
exports.MonthlySubscriptionCron = MonthlySubscriptionCron;
__decorate([
    (0, schedule_1.Cron)('0 12 L * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonthlySubscriptionCron.prototype, "handleMonthlySubscriptionDebit", null);
exports.MonthlySubscriptionCron = MonthlySubscriptionCron = MonthlySubscriptionCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MonthlySubscriptionCron);
//# sourceMappingURL=monthly-subscription.cron.js.map