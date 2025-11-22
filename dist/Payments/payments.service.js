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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const subscribers_service_1 = require("../subscribers/subscribers.service");
const managers_service_1 = require("../managers/managers.service");
const africas_talking_service_1 = require("../africas-talking/africas-talking.service");
const SERVICE_FEE_PERCENT = Number(process.env.SERVICE_FEE_PERCENT || 10);
let PaymentsService = class PaymentsService {
    constructor(subscribersService, managersService, sms) {
        this.subscribersService = subscribersService;
        this.managersService = managersService;
        this.sms = sms;
    }
    async processPayment(subscriberId, managerId, amount, method) {
        const serviceFee = (amount * SERVICE_FEE_PERCENT) / 100;
        const subscriberAmount = amount - serviceFee;
        if (method === 'Cash') {
            this.managersService.addServiceFee(managerId, serviceFee);
        }
        const days = Math.max(1, Math.floor(subscriberAmount / 100));
        const code = this.subscribersService.generateCode(days);
        const activation = await this.subscribersService.activate({
            subscriberId,
            days,
            code,
        });
        return {
            message: 'Payment processed',
            subscriberId,
            managerId,
            amount,
            serviceFee,
            days,
            code,
            activation,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscribers_service_1.SubscribersService,
        managers_service_1.ManagersService,
        africas_talking_service_1.AfricasTalkingService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map