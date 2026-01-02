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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
const subscriber_entity_1 = require("../entities/subscriber.entity");
const service_fee_summary_entity_1 = require("../entities/service-fee-summary.entity");
let AdminService = class AdminService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getMetrics() {
        const managerRepo = this.dataSource.getRepository(manager_entity_1.Manager);
        const subscriberRepo = this.dataSource.getRepository(subscriber_entity_1.Subscriber);
        const feeRepo = this.dataSource.getRepository(service_fee_summary_entity_1.ServiceFeeSummary);
        const totalManagers = await managerRepo.count();
        const totalSubscribers = await subscriberRepo.count();
        const { sum } = await feeRepo
            .createQueryBuilder('f')
            .select('COALESCE(SUM(f.amount), 0)', 'sum')
            .getRawOne();
        return {
            totalManagers,
            totalSubscribers,
            totalRevenue: Number(sum),
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AdminService);
//# sourceMappingURL=admin.service.js.map