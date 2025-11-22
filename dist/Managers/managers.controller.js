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
exports.ManagersController = void 0;
const common_1 = require("@nestjs/common");
const managers_service_1 = require("./managers.service");
const create_manager_dto_1 = require("./dto/create-manager.dto");
let ManagersController = class ManagersController {
    constructor(managersService) {
        this.managersService = managersService;
    }
    create(dto) {
        return this.managersService.create(dto);
    }
    list() {
        return this.managersService.findAll();
    }
    addFee(id, body) {
        return this.managersService.addServiceFee(+id, body.amount);
    }
    clearFee(id) {
        return this.managersService.clearServiceFee(+id);
    }
};
exports.ManagersController = ManagersController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_manager_dto_1.CreateManagerDto]),
    __metadata("design:returntype", void 0)
], ManagersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManagersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/add-fee'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagersController.prototype, "addFee", null);
__decorate([
    (0, common_1.Post)(':id/clear-fee'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManagersController.prototype, "clearFee", null);
exports.ManagersController = ManagersController = __decorate([
    (0, common_1.Controller)('managers'),
    __metadata("design:paramtypes", [managers_service_1.ManagersService])
], ManagersController);
//# sourceMappingURL=managers.controller.js.map