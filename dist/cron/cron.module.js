"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const manager_entity_1 = require("../entities/manager.entity");
const abuse_module_1 = require("../abuse/abuse.module");
const enforcement_cron_1 = require("./enforcement.cron");
const reset_counters_cron_1 = require("./reset.counters.cron");
let CronModule = class CronModule {
};
exports.CronModule = CronModule;
exports.CronModule = CronModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([manager_entity_1.Manager]),
            abuse_module_1.AbuseModule,
        ],
        providers: [
            enforcement_cron_1.EnforcementCron,
            reset_counters_cron_1.ResetCountersCron,
        ],
    })
], CronModule);
//# sourceMappingURL=cron.module.js.map