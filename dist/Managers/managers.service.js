"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagersService = void 0;
const common_1 = require("@nestjs/common");
let ManagersService = class ManagersService {
    constructor() {
        this.managers = [];
        this.nextId = 1;
    }
    create(dto) {
        const manager = { id: this.nextId++, name: dto.name, phone: dto.phone, pendingServiceFee: 0 };
        this.managers.push(manager);
        return manager;
    }
    findAll() {
        return this.managers;
    }
    addServiceFee(managerId, amount) {
        const manager = this.managers.find(m => m.id === managerId);
        if (!manager)
            throw new Error('Manager not found');
        manager.pendingServiceFee = (manager.pendingServiceFee || 0) + amount;
        return manager.pendingServiceFee;
    }
    clearServiceFee(managerId) {
        const manager = this.managers.find(m => m.id === managerId);
        if (!manager)
            throw new Error('Manager not found');
        manager.pendingServiceFee = 0;
        return manager.pendingServiceFee;
    }
    getById(id) {
        return this.managers.find(m => m.id === id);
    }
};
exports.ManagersService = ManagersService;
exports.ManagersService = ManagersService = __decorate([
    (0, common_1.Injectable)()
], ManagersService);
//# sourceMappingURL=managers.service.js.map