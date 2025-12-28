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
const swagger_1 = require("@nestjs/swagger");
const managers_service_1 = require("./managers.service");
const create_manager_dto_1 = require("./dto/create-manager.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let ManagersController = class ManagersController {
    constructor(managersService) {
        this.managersService = managersService;
    }
    async create(dto) {
        return this.managersService.create(dto);
    }
    async findAll() {
        return this.managersService.findAll();
    }
    async getById(id) {
        return this.managersService.getById(Number(id));
    }
};
exports.ManagersController = ManagersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new manager (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Manager created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_manager_dto_1.CreateManagerDto]),
    __metadata("design:returntype", Promise)
], ManagersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List all managers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Managers retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Get manager by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Manager retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Manager not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagersController.prototype, "getById", null);
exports.ManagersController = ManagersController = __decorate([
    (0, swagger_1.ApiTags)('Managers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('managers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [managers_service_1.ManagersService])
], ManagersController);
//# sourceMappingURL=managers.controller.js.map