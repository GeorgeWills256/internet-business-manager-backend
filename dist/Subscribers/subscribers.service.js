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
exports.SubscribersService = void 0;
const common_1 = require("@nestjs/common");
const africas_talking_service_1 = require("../africas-talking/africas-talking.service");
let SubscribersService = class SubscribersService {
    constructor(sms) {
        this.sms = sms;
        this.subscribers = [];
        this.codeCounter = 1000;
    }
    register(dto) {
        const subscriber = {
            id: this.subscribers.length + 1,
            phone: dto.phone,
            managerId: dto.managerId,
            activeUntil: null,
        };
        this.subscribers.push(subscriber);
        return subscriber;
    }
    generateCode(days) {
        return `NET${this.codeCounter++}-${days}D`;
    }
    async activate(dto) {
        const subscriber = this.subscribers.find(s => s.id === dto.subscriberId);
        if (!subscriber)
            throw new Error('Subscriber not found');
        const now = new Date();
        const expiry = new Date(now.getTime() + dto.days * 24 * 60 * 60 * 1000);
        subscriber.activeUntil = expiry;
        await this.sms.sendSMS(subscriber.phone, `Your internet has been activated for ${dto.days} days. Expiry: ${expiry.toISOString()}`);
        return { message: 'Subscriber activated', subscriber };
    }
    deactivateExpired() {
        const now = new Date();
        this.subscribers.forEach(sub => {
            if (sub.activeUntil && now > sub.activeUntil) {
                sub.activeUntil = null;
            }
        });
    }
    list() {
        return this.subscribers;
    }
};
exports.SubscribersService = SubscribersService;
exports.SubscribersService = SubscribersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [africas_talking_service_1.AfricasTalkingService])
], SubscribersService);
//# sourceMappingURL=subscribers.service.js.map