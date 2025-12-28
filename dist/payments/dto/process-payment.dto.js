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
exports.ProcessPaymentDto = exports.PaymentMethod = void 0;
const class_validator_1 = require("class-validator");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["MOBILE"] = "mobile";
    PaymentMethod["CASH"] = "cash";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
class ProcessPaymentDto {
}
exports.ProcessPaymentDto = ProcessPaymentDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProcessPaymentDto.prototype, "managerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProcessPaymentDto.prototype, "subscriberId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProcessPaymentDto.prototype, "days", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], ProcessPaymentDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProcessPaymentDto.prototype, "mobileReference", void 0);
//# sourceMappingURL=process-payment.dto.js.map