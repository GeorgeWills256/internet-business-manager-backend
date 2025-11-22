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
exports.CodesController = void 0;
const common_1 = require("@nestjs/common");
const codes_service_1 = require("./codes.service");
let CodesController = class CodesController {
    constructor(codesService) {
        this.codesService = codesService;
    }
    async generate(body) {
        return this.codesService.generateCode(body.managerId, body.subscriberId, body.duration);
    }
    async managerCodes(managerId) {
        return this.codesService.getCodesByManager(+managerId);
    }
};
exports.CodesController = CodesController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CodesController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)('manager/:managerId'),
    __param(0, (0, common_1.Param)('managerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CodesController.prototype, "managerCodes", null);
exports.CodesController = CodesController = __decorate([
    (0, common_1.Controller)('codes'),
    __metadata("design:paramtypes", [codes_service_1.CodesService])
], CodesController);
//# sourceMappingURL=codes.controller.js.map