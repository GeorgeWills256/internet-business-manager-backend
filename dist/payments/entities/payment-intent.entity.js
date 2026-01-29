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
exports.PaymentIntent = exports.PaymentIntentStatus = void 0;
const typeorm_1 = require("typeorm");
var PaymentIntentStatus;
(function (PaymentIntentStatus) {
    PaymentIntentStatus["PENDING"] = "PENDING";
    PaymentIntentStatus["SUCCESS"] = "SUCCESS";
    PaymentIntentStatus["FAILED"] = "FAILED";
})(PaymentIntentStatus || (exports.PaymentIntentStatus = PaymentIntentStatus = {}));
let PaymentIntent = class PaymentIntent {
};
exports.PaymentIntent = PaymentIntent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentIntent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PaymentIntent.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentIntent.prototype, "portalSessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], PaymentIntent.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], PaymentIntent.prototype, "days", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentIntent.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentIntentStatus,
        default: PaymentIntentStatus.PENDING,
    }),
    __metadata("design:type", String)
], PaymentIntent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentIntent.prototype, "providerTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentIntent.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PaymentIntent.prototype, "createdAt", void 0);
exports.PaymentIntent = PaymentIntent = __decorate([
    (0, typeorm_1.Entity)()
], PaymentIntent);
//# sourceMappingURL=payment-intent.entity.js.map