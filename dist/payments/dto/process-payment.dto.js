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
exports.ProcessPaymentDto = exports.PricingPackage = exports.PaymentMethod = void 0;
const class_validator_1 = require("class-validator");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["MOBILE"] = "mobile";
    PaymentMethod["CASH"] = "cash";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PricingPackage;
(function (PricingPackage) {
    PricingPackage["TWO_HOURS"] = "2H";
    PricingPackage["FOUR_HOURS"] = "4H";
    PricingPackage["ONE_DAY"] = "1D";
    PricingPackage["SEVEN_DAYS"] = "7D";
    PricingPackage["THIRTY_DAYS"] = "30D";
})(PricingPackage || (exports.PricingPackage = PricingPackage = {}));
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
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentDto.prototype, "portalSessionId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PricingPackage),
    __metadata("design:type", String)
], ProcessPaymentDto.prototype, "package", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProcessPaymentDto.prototype, "devices", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], ProcessPaymentDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessPaymentDto.prototype, "mobileReference", void 0);
//# sourceMappingURL=process-payment.dto.js.map