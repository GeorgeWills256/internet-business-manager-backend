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
var MonthlySubscriptionCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlySubscriptionCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("typeorm");
const manager_entity_1 = require("../../entities/manager.entity");
const notification_service_1 = require("../../notifications/notification.service");
let MonthlySubscriptionCron = MonthlySubscriptionCron_1 = class MonthlySubscriptionCron {
    constructor(dataSource, notificationService) {
        this.dataSource = dataSource;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(MonthlySubscriptionCron_1.name);
    }
    async handleMonthlySubscriptions() {
        const repo = this.dataSource.getRepository(manager_entity_1.Manager);
        const now = new Date();
        const managers = await repo.find();
        for (const manager of managers) {
            if (!manager.subscriptionDueAt)
                continue;
            const hoursRemaining = (manager.subscriptionDueAt.getTime() -
                now.getTime()) /
                (1000 * 60 * 60);
            if (hoursRemaining <= 48 && hoursRemaining > 24) {
                await this.notificationService.sendSMS(manager.phone, '⚠️ Subscription due in 48 hours.');
            }
            if (hoursRemaining <= 24 && hoursRemaining > 0) {
                await this.notificationService.sendSMS(manager.phone, '🚨 Subscription expires in 24 hours.');
            }
            if (manager.monthlySubscriptionGraceUntil &&
                manager.monthlySubscriptionGraceUntil < now) {
                manager.isSuspended = true;
                manager.suspensionReason =
                    'Monthly subscription unpaid';
                await repo.save(manager);
                await this.notificationService.sendSMS(manager.phone, '⛔ Services blocked due to unpaid subscription.');
                this.logger.error(`Manager ${manager.id} BLOCKED`);
            }
        }
    }
};
exports.MonthlySubscriptionCron = MonthlySubscriptionCron;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonthlySubscriptionCron.prototype, "handleMonthlySubscriptions", null);
exports.MonthlySubscriptionCron = MonthlySubscriptionCron = MonthlySubscriptionCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        notification_service_1.NotificationService])
], MonthlySubscriptionCron);
//# sourceMappingURL=monthly-subscription.cron.js.map