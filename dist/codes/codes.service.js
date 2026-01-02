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
exports.CodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const code_entity_1 = require("../entities/code.entity");
const manager_entity_1 = require("../entities/manager.entity");
const subscribers_service_1 = require("../subscribers/subscribers.service");
const abuse_service_1 = require("../abuse/abuse.service");
let CodesService = class CodesService {
    constructor(codesRepo, managersRepo, subscribersService, abuseService) {
        this.codesRepo = codesRepo;
        this.managersRepo = managersRepo;
        this.subscribersService = subscribersService;
        this.abuseService = abuseService;
    }
    async generateFreeCode(managerId) {
        const manager = await this.managersRepo.findOne({
            where: { id: managerId },
        });
        if (!manager) {
            throw new common_1.NotFoundException('Manager not found');
        }
        this.abuseService.assertAllowed(manager, abuse_service_1.AbuseAction.ISSUE_FREE_CODE);
        const today = new Date().toISOString().slice(0, 10);
        if (manager.freeCodesIssuedDate !== today) {
            manager.freeCodesIssuedDate = today;
            manager.freeCodesIssuedToday = 0;
        }
        manager.freeCodesIssuedToday += 1;
        await this.managersRepo.save(manager);
        const code = this.codesRepo.create({
            code: this.randomCode(),
            daysGranted: 1,
            isFree: true,
            used: false,
            manager,
        });
        return this.codesRepo.save(code);
    }
    async redeemCode(dto) {
        const code = await this.codesRepo.findOne({
            where: { code: dto.codeValue, used: false },
            relations: ['manager'],
        });
        if (!code) {
            throw new common_1.BadRequestException('Invalid or already used code');
        }
        this.abuseService.assertAllowed(code.manager, abuse_service_1.AbuseAction.ACTIVATE_SUBSCRIBER);
        await this.subscribersService.activate({
            subscriberId: dto.subscriberId,
            days: code.daysGranted,
            source: 'code',
        });
        code.used = true;
        code.usedAt = new Date();
        await this.codesRepo.save(code);
        return {
            ok: true,
            daysGranted: code.daysGranted,
        };
    }
    randomCode() {
        return Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase();
    }
};
exports.CodesService = CodesService;
exports.CodesService = CodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(code_entity_1.Code)),
    __param(1, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        subscribers_service_1.SubscribersService,
        abuse_service_1.AbuseService])
], CodesService);
//# sourceMappingURL=codes.service.js.map