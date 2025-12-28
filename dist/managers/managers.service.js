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
var ManagersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
let ManagersService = ManagersService_1 = class ManagersService {
    constructor(managersRepo) {
        this.managersRepo = managersRepo;
        this.logger = new common_1.Logger(ManagersService_1.name);
    }
    async create(dto) {
        const manager = this.managersRepo.create({
            phone: dto.phone,
            username: dto.username,
        });
        this.logger.log(`Creating manager with phone ${dto.phone}`);
        return this.managersRepo.save(manager);
    }
    async findAll() {
        return this.managersRepo.find();
    }
    async getById(id) {
        const manager = await this.managersRepo.findOneBy({ id });
        if (!manager) {
            this.logger.warn(`Manager not found: ${id}`);
            throw new common_1.NotFoundException('Manager not found');
        }
        return manager;
    }
    async addServiceFee(managerId, amount) {
        const manager = await this.getById(managerId);
        manager.pendingWeeklyFee =
            (manager.pendingWeeklyFee ?? 0) + amount;
        await this.managersRepo.save(manager);
        this.logger.log(`Added service fee ${amount} to manager ${managerId}`);
        return manager.pendingWeeklyFee;
    }
    async clearServiceFee(managerId) {
        const manager = await this.getById(managerId);
        manager.pendingWeeklyFee = 0;
        manager.pendingGraceExpiry = null;
        await this.managersRepo.save(manager);
        this.logger.log(`Cleared service fee for manager ${managerId}`);
        return 0;
    }
};
exports.ManagersService = ManagersService;
exports.ManagersService = ManagersService = ManagersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ManagersService);
//# sourceMappingURL=managers.service.js.map