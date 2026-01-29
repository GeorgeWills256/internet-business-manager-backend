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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getMetrics() {
        return this.adminService.getMetrics();
    }
    getSystemRevenueSummary() {
        return this.adminService.getSystemRevenueSummary();
    }
    getMonthlySubscriptions() {
        return this.adminService.getMonthlySubscriptionOverview();
    }
    getManagerCompliance() {
        return this.adminService.getManagerComplianceTable();
    }
    getDailyRevenue() {
        return this.adminService.getDailyRevenue(30);
    }
    getMonthlyRevenue() {
        return this.adminService.getMonthlyRevenue(12);
    }
    async exportSystemRevenueCSV() {
        const csv = await this.adminService.exportSystemRevenueCSV();
        return {
            filename: `system-revenue-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`,
            contentType: 'text/csv',
            data: csv,
        };
    }
    suspendManager(managerId, suspend, reason) {
        return this.adminService.setManagerSuspension(Number(managerId), suspend === 'true', reason);
    }
    unblockManager(managerId) {
        return this.adminService.manualUnblockManager(Number(managerId));
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('dashboard/system-revenue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSystemRevenueSummary", null);
__decorate([
    (0, common_1.Get)('dashboard/subscriptions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMonthlySubscriptions", null);
__decorate([
    (0, common_1.Get)('dashboard/managers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getManagerCompliance", null);
__decorate([
    (0, common_1.Get)('charts/revenue-daily'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDailyRevenue", null);
__decorate([
    (0, common_1.Get)('charts/revenue-monthly'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMonthlyRevenue", null);
__decorate([
    (0, common_1.Get)('export/system-revenue.csv'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportSystemRevenueCSV", null);
__decorate([
    (0, common_1.Get)('manager/suspend'),
    __param(0, (0, common_1.Query)('managerId')),
    __param(1, (0, common_1.Query)('suspend')),
    __param(2, (0, common_1.Query)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "suspendManager", null);
__decorate([
    (0, common_1.Get)('manager/unblock'),
    __param(0, (0, common_1.Query)('managerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "unblockManager", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map