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
exports.Manager = void 0;
const typeorm_1 = require("typeorm");
const subscriber_entity_1 = require("./subscriber.entity");
const code_entity_1 = require("./code.entity");
let Manager = class Manager {
};
exports.Manager = Manager;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Manager.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Manager.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Manager.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Manager.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Manager.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Manager.prototype, "isManager", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Manager.prototype, "canActAsSalesperson", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Manager.prototype, "isSuspended", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Manager.prototype, "suspendedUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Manager.prototype, "suspensionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 5 }),
    __metadata("design:type", Number)
], Manager.prototype, "dailyFreeCodesLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1000 }),
    __metadata("design:type", Number)
], Manager.prototype, "dailyInternetFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Manager.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Manager.prototype, "pendingWeeklyFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Manager.prototype, "pendingGraceExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Manager.prototype, "freeCodesIssuedToday", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Manager.prototype, "freeCodesIssuedDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscriber_entity_1.Subscriber, (s) => s.manager),
    __metadata("design:type", Array)
], Manager.prototype, "subscribers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => code_entity_1.Code, (c) => c.manager),
    __metadata("design:type", Array)
], Manager.prototype, "codes", void 0);
exports.Manager = Manager = __decorate([
    (0, typeorm_1.Entity)()
], Manager);
//# sourceMappingURL=manager.entity.js.map