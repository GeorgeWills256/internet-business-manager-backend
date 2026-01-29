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
exports.SystemRevenue = void 0;
const typeorm_1 = require("typeorm");
let SystemRevenue = class SystemRevenue {
};
exports.SystemRevenue = SystemRevenue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SystemRevenue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SystemRevenue.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], SystemRevenue.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], SystemRevenue.prototype, "tier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", String)
], SystemRevenue.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], SystemRevenue.prototype, "createdAt", void 0);
exports.SystemRevenue = SystemRevenue = __decorate([
    (0, typeorm_1.Entity)()
], SystemRevenue);
//# sourceMappingURL=system-revenue.entity.js.map