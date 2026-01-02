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
var ResetCountersCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetCountersCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
let ResetCountersCron = ResetCountersCron_1 = class ResetCountersCron {
    constructor(managersRepo) {
        this.managersRepo = managersRepo;
        this.logger = new common_1.Logger(ResetCountersCron_1.name);
    }
    async resetDailyCounters() {
        await this.managersRepo
            .createQueryBuilder()
            .update()
            .set({
            freeCodesIssuedToday: 0,
            freeCodesIssuedDate: null,
        })
            .execute();
        this.logger.log('Daily free code counters reset');
    }
};
exports.ResetCountersCron = ResetCountersCron;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResetCountersCron.prototype, "resetDailyCounters", null);
exports.ResetCountersCron = ResetCountersCron = ResetCountersCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResetCountersCron);
//# sourceMappingURL=reset.counters.cron.js.map