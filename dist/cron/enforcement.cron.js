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
var EnforcementCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnforcementCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
const abuse_service_1 = require("../abuse/abuse.service");
let EnforcementCron = EnforcementCron_1 = class EnforcementCron {
    constructor(managersRepo, abuseService) {
        this.managersRepo = managersRepo;
        this.abuseService = abuseService;
        this.logger = new common_1.Logger(EnforcementCron_1.name);
    }
    async enforceBusinessRules() {
        this.logger.log('Running enforcement cron...');
        const now = new Date();
        const overdueManagers = await this.managersRepo.find({
            where: {
                pendingGraceExpiry: (0, typeorm_2.LessThan)(now),
            },
        });
        for (const manager of overdueManagers) {
            try {
                this.abuseService.assertAllowed(manager, abuse_service_1.AbuseAction.ACTIVATE_SUBSCRIBER);
            }
            catch (err) {
                manager.isSuspended = true;
                await this.managersRepo.save(manager);
                this.logger.warn(`Manager ${manager.id} suspended due to expired grace period`);
            }
        }
        this.logger.log(`Enforcement completed. Checked ${overdueManagers.length} managers.`);
    }
};
exports.EnforcementCron = EnforcementCron;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnforcementCron.prototype, "enforceBusinessRules", null);
exports.EnforcementCron = EnforcementCron = EnforcementCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        abuse_service_1.AbuseService])
], EnforcementCron);
//# sourceMappingURL=enforcement.cron.js.map