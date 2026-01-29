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
exports.PortalController = void 0;
const common_1 = require("@nestjs/common");
const portal_service_1 = require("./portal.service");
let PortalController = class PortalController {
    constructor(portalService) {
        this.portalService = portalService;
    }
    async startSession(managerId, macAddress, ipAddress, routerId) {
        if (!managerId || !macAddress) {
            throw new common_1.BadRequestException('managerId and mac are required');
        }
        return this.portalService.createSession({
            managerId: Number(managerId),
            macAddress,
            ipAddress,
            routerId,
        });
    }
    async checkAccess(macAddress) {
        return this.portalService.checkAccess(macAddress);
    }
    async previewPrice(managerId, pkg, devices = '1') {
        if (!managerId || !pkg) {
            throw new common_1.BadRequestException('managerId and package are required');
        }
        return this.portalService.previewPrice({
            managerId: Number(managerId),
            package: pkg,
            devices: Number(devices),
        });
    }
    async payNow(sessionId, pkg, devices = '1') {
        if (!sessionId || !pkg) {
            throw new common_1.BadRequestException('sessionId and package are required');
        }
        return this.portalService.preparePayNow({
            sessionId,
            package: pkg,
            devices: Number(devices),
        });
    }
};
exports.PortalController = PortalController;
__decorate([
    (0, common_1.Get)('start'),
    __param(0, (0, common_1.Query)('managerId')),
    __param(1, (0, common_1.Query)('mac')),
    __param(2, (0, common_1.Query)('ip')),
    __param(3, (0, common_1.Query)('routerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "startSession", null);
__decorate([
    (0, common_1.Get)('check-access'),
    __param(0, (0, common_1.Query)('mac')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "checkAccess", null);
__decorate([
    (0, common_1.Get)('price-preview'),
    __param(0, (0, common_1.Query)('managerId')),
    __param(1, (0, common_1.Query)('package')),
    __param(2, (0, common_1.Query)('devices')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "previewPrice", null);
__decorate([
    (0, common_1.Get)('pay-now'),
    __param(0, (0, common_1.Query)('sessionId')),
    __param(1, (0, common_1.Query)('package')),
    __param(2, (0, common_1.Query)('devices')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "payNow", null);
exports.PortalController = PortalController = __decorate([
    (0, common_1.Controller)('portal'),
    __metadata("design:paramtypes", [portal_service_1.PortalService])
], PortalController);
//# sourceMappingURL=portal.controller.js.map