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
exports.MobileMoneyTransaction = void 0;
const typeorm_1 = require("typeorm");
let MobileMoneyTransaction = class MobileMoneyTransaction {
};
exports.MobileMoneyTransaction = MobileMoneyTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MobileMoneyTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MobileMoneyTransaction.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MobileMoneyTransaction.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], MobileMoneyTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MobileMoneyTransaction.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MobileMoneyTransaction.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MobileMoneyTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MobileMoneyTransaction.prototype, "portalSessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], MobileMoneyTransaction.prototype, "rawPayload", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MobileMoneyTransaction.prototype, "createdAt", void 0);
exports.MobileMoneyTransaction = MobileMoneyTransaction = __decorate([
    (0, typeorm_1.Entity)()
], MobileMoneyTransaction);
//# sourceMappingURL=mobile-money-transaction.entity.js.map