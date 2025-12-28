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
exports.Subscriber = void 0;
const typeorm_1 = require("typeorm");
const manager_entity_1 = require("./manager.entity");
let Subscriber = class Subscriber {
};
exports.Subscriber = Subscriber;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Subscriber.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subscriber.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Subscriber.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Subscriber.prototype, "daysPurchased", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Subscriber.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => manager_entity_1.Manager, (manager) => manager.subscribers, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", manager_entity_1.Manager)
], Subscriber.prototype, "manager", void 0);
exports.Subscriber = Subscriber = __decorate([
    (0, typeorm_1.Entity)()
], Subscriber);
//# sourceMappingURL=subscriber.entity.js.map