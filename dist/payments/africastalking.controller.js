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
var AfricasTalkingController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfricasTalkingController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
let AfricasTalkingController = AfricasTalkingController_1 = class AfricasTalkingController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
        this.logger = new common_1.Logger(AfricasTalkingController_1.name);
    }
    async webhook(payload) {
        this.logger.log('Received Africa’s Talking webhook');
        return this.paymentsService.handleMobileMoneyWebhook(payload);
    }
};
exports.AfricasTalkingController = AfricasTalkingController;
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AfricasTalkingController.prototype, "webhook", null);
exports.AfricasTalkingController = AfricasTalkingController = AfricasTalkingController_1 = __decorate([
    (0, common_1.Controller)('payments/africastalking'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], AfricasTalkingController);
//# sourceMappingURL=africastalking.controller.js.map