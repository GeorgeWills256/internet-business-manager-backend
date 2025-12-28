"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const subscriber_entity_1 = require("../entities/subscriber.entity");
const manager_entity_1 = require("../entities/manager.entity");
const subscribers_service_1 = require("./subscribers.service");
const subscribers_controller_1 = require("./subscribers.controller");
const africas_talking_module_1 = require("../africas-talking/africas-talking.module");
let SubscribersModule = class SubscribersModule {
};
exports.SubscribersModule = SubscribersModule;
exports.SubscribersModule = SubscribersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([subscriber_entity_1.Subscriber, manager_entity_1.Manager]),
            africas_talking_module_1.AfricasTalkingModule,
        ],
        controllers: [subscribers_controller_1.SubscribersController],
        providers: [subscribers_service_1.SubscribersService],
        exports: [subscribers_service_1.SubscribersService],
    })
], SubscribersModule);
//# sourceMappingURL=subscribers.module.js.map