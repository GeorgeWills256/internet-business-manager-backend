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
exports.PortalSession = exports.PortalSessionStatus = void 0;
const typeorm_1 = require("typeorm");
const subscriber_entity_1 = require("../../entities/subscriber.entity");
var PortalSessionStatus;
(function (PortalSessionStatus) {
    PortalSessionStatus["CREATED"] = "CREATED";
    PortalSessionStatus["PAYMENT_PENDING"] = "PAYMENT_PENDING";
    PortalSessionStatus["PAID"] = "PAID";
    PortalSessionStatus["ACCESS_GRANTED"] = "ACCESS_GRANTED";
    PortalSessionStatus["EXPIRED"] = "EXPIRED";
})(PortalSessionStatus || (exports.PortalSessionStatus = PortalSessionStatus = {}));
let PortalSession = class PortalSession {
};
exports.PortalSession = PortalSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PortalSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PortalSession.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PortalSession.prototype, "macAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PortalSession.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PortalSession.prototype, "routerId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PortalSessionStatus,
        default: PortalSessionStatus.CREATED,
    }),
    __metadata("design:type", String)
], PortalSession.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscriber_entity_1.Subscriber, { nullable: true }),
    __metadata("design:type", subscriber_entity_1.Subscriber)
], PortalSession.prototype, "subscriber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PortalSession.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], PortalSession.prototype, "amountPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], PortalSession.prototype, "daysGranted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PortalSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], PortalSession.prototype, "expiresAt", void 0);
exports.PortalSession = PortalSession = __decorate([
    (0, typeorm_1.Entity)()
], PortalSession);
//# sourceMappingURL=portal-session.entity.js.map