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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule = require("node-schedule");
const managers_service_1 = require("../managers/managers.service");
const subscribers_service_1 = require("../subscribers/subscribers.service");
const codes_service_1 = require("../codes/codes.service");
let SchedulerService = class SchedulerService {
    constructor(managersService, subscribersService, codesService) {
        this.managersService = managersService;
        this.subscribersService = subscribersService;
        this.codesService = codesService;
        this.logger = new common_1.Logger('SchedulerService');
        this.setupJobs();
    }
    setupJobs() {
        schedule.scheduleJob('0 18 * * 6', () => {
            this.logger.log('Saturday 18:00 — Checking service fee balances');
            const managers = this.managersService.findAll();
            managers.forEach(m => {
                if (m.pendingServiceFee > 0) {
                    this.logger.warn(`Manager ${m.name} still owes service fees: ${m.pendingServiceFee}`);
                }
            });
        });
        schedule.scheduleJob('59 23 * * 6', () => {
            this.logger.log('Saturday 23:59 — Disconnecting unpaid managers');
            const managers = this.managersService.findAll();
            managers.forEach(manager => {
                if (manager.pendingServiceFee > 0) {
                    this.logger.warn(`Disconnecting subscribers for manager ${manager.name} due to unpaid fees...`);
                    this.codesService.expireCodesByManager(manager.id);
                    const subs = this.subscribersService
                        .list()
                        .filter(s => s.managerId === manager.id);
                    subs.forEach(sub => (sub.activeUntil = null));
                }
            });
        });
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [managers_service_1.ManagersService,
        subscribers_service_1.SubscribersService,
        codes_service_1.CodesService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map