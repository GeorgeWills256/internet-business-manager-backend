"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbuseService = exports.AbuseAction = void 0;
const common_1 = require("@nestjs/common");
const abuse_limits_1 = require("./constants/abuse-limits");
var AbuseAction;
(function (AbuseAction) {
    AbuseAction["ISSUE_FREE_CODE"] = "ISSUE_FREE_CODE";
    AbuseAction["ACTIVATE_SUBSCRIBER"] = "ACTIVATE_SUBSCRIBER";
    AbuseAction["RECEIVE_PAYMENT"] = "RECEIVE_PAYMENT";
})(AbuseAction || (exports.AbuseAction = AbuseAction = {}));
let AbuseService = class AbuseService {
    assertAllowed(manager, action) {
        this.checkSuspension(manager);
        this.checkFreeCodeLimit(manager, action);
    }
    checkSuspension(manager) {
        if (manager.isSuspended) {
            if (manager.suspendedUntil &&
                manager.suspendedUntil < new Date()) {
                manager.isSuspended = false;
                manager.suspendedUntil = null;
                manager.suspensionReason = null;
                return;
            }
            throw new common_1.ForbiddenException(manager.suspensionReason ||
                'Account suspended. Contact support.');
        }
    }
    checkFreeCodeLimit(manager, action) {
        if (action !== AbuseAction.ISSUE_FREE_CODE)
            return;
        if (manager.freeCodesIssuedToday >=
            abuse_limits_1.ABUSE_LIMITS.FREE_CODES_PER_DAY) {
            throw new common_1.ForbiddenException('Daily free code limit reached');
        }
    }
};
exports.AbuseService = AbuseService;
exports.AbuseService = AbuseService = __decorate([
    (0, common_1.Injectable)()
], AbuseService);
//# sourceMappingURL=abuse.service.js.map