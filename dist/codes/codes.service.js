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
exports.CodesService = exports.CodeStatus = void 0;
const common_1 = require("@nestjs/common");
const subscribers_service_1 = require("../subscribers/subscribers.service");
const managers_service_1 = require("../managers/managers.service");
const africas_talking_service_1 = require("../africas-talking/africas-talking.service");
var CodeStatus;
(function (CodeStatus) {
    CodeStatus["UNUSED"] = "unused";
    CodeStatus["GIVEN"] = "given";
    CodeStatus["EXPIRED"] = "expired";
})(CodeStatus || (exports.CodeStatus = CodeStatus = {}));
let CodesService = class CodesService {
    constructor(subscribersService, managersService, sms) {
        this.subscribersService = subscribersService;
        this.managersService = managersService;
        this.sms = sms;
        this.codes = [];
        this.nextId = 1;
    }
    generateRandomCode(len = 12) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let out = '';
        for (let i = 0; i < len; i++) {
            out += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return out;
    }
    async generateCode(managerId, subscriberId, duration) {
        const codeStr = this.generateRandomCode();
        const code = {
            id: this.nextId++,
            code: codeStr,
            managerId,
            subscriberId,
            duration,
            status: CodeStatus.GIVEN,
        };
        this.codes.push(code);
        const sub = this.subscribersService.list().find(s => s.id === subscriberId);
        if (sub) {
            await this.sms.sendSMS(sub.phone, `Your internet code is ${codeStr}. Valid for ${duration} days.`);
        }
        return code;
    }
    getCodesByManager(managerId) {
        const codes = this.codes.filter(c => c.managerId === managerId);
        const summary = {
            total: codes.length,
            given: codes.filter(c => c.status === CodeStatus.GIVEN).length,
            unused: codes.filter(c => c.status === CodeStatus.UNUSED).length,
            expired: codes.filter(c => c.status === CodeStatus.EXPIRED).length,
            codes,
        };
        return summary;
    }
    expireCodesByManager(managerId) {
        this.codes.forEach(code => {
            if (code.managerId === managerId && code.status === CodeStatus.GIVEN) {
                code.status = CodeStatus.EXPIRED;
            }
        });
    }
};
exports.CodesService = CodesService;
exports.CodesService = CodesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscribers_service_1.SubscribersService,
        managers_service_1.ManagersService,
        africas_talking_service_1.AfricasTalkingService])
], CodesService);
//# sourceMappingURL=codes.service.js.map