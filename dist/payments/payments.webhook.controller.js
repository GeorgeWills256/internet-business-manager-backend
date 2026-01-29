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
var PaymentsWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
let PaymentsWebhookController = PaymentsWebhookController_1 = class PaymentsWebhookController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
        this.logger = new common_1.Logger(PaymentsWebhookController_1.name);
    }
    async handleAfricasTalkingWebhook(payload, headers) {
        this.logger.log(`Received Africa’s Talking webhook`);
        if (!payload?.transactionId ||
            !payload?.status ||
            !payload?.metadata) {
            this.logger.warn('Invalid webhook payload received');
            return { ok: false };
        }
        await this.paymentsService.handleMobileMoneyWebhook(payload);
        return { ok: true };
    }
};
exports.PaymentsWebhookController = PaymentsWebhookController;
__decorate([
    (0, common_1.Post)('africas-talking'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Africa’s Talking Mobile Money Webhook',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsWebhookController.prototype, "handleAfricasTalkingWebhook", null);
exports.PaymentsWebhookController = PaymentsWebhookController = PaymentsWebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('Payments Webhook'),
    (0, common_1.Controller)('payments/webhook'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsWebhookController);
//# sourceMappingURL=payments.webhook.controller.js.map