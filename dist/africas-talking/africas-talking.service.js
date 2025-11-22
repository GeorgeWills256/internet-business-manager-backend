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
exports.AfricasTalkingService = void 0;
const common_1 = require("@nestjs/common");
const AT = require("africastalking");
let AfricasTalkingService = class AfricasTalkingService {
    constructor() {
        this.logger = new common_1.Logger('AfricasTalking');
        const username = process.env.AT_USERNAME;
        const apiKey = process.env.AT_API_KEY;
        if (!username || !apiKey) {
            this.logger.warn("Africa's Talking not configured (AT_USERNAME/AT_API_KEY missing)");
            return;
        }
        const africasTalking = AT({
            apiKey,
            username,
        });
        this.sms = africasTalking.SMS;
    }
    async sendSMS(phone, message) {
        if (!this.sms) {
            this.logger.warn('SMS skipped (Africa’s Talking not configured)');
            return;
        }
        try {
            const res = await this.sms.send({
                to: phone,
                message,
            });
            this.logger.log(`SMS sent to ${phone}`);
            return res;
        }
        catch (err) {
            this.logger.error(`SMS failed: ${err.message}`);
            throw err;
        }
    }
};
exports.AfricasTalkingService = AfricasTalkingService;
exports.AfricasTalkingService = AfricasTalkingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AfricasTalkingService);
//# sourceMappingURL=africas-talking.service.js.map