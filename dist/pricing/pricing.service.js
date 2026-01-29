"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const pricing_config_1 = require("./pricing.config");
let PricingService = class PricingService {
    calculatePrice(input) {
        const pkg = pricing_config_1.TIME_PACKAGES[input.packageKey];
        if (!pkg) {
            throw new common_1.BadRequestException('Invalid package');
        }
        const deviceMultiplier = pricing_config_1.DEVICE_MULTIPLIERS[input.devices];
        if (!deviceMultiplier) {
            throw new common_1.BadRequestException('Invalid device count');
        }
        const basePrice = input.dailyPrice * pkg.multiplier;
        const finalPrice = Math.round(basePrice * deviceMultiplier);
        return {
            package: input.packageKey,
            devices: input.devices,
            basePrice,
            finalPrice,
            durationDays: pkg.daysEquivalent,
        };
    }
    buildPriceTable(dailyPrice) {
        const table = [];
        for (const pkgKey in pricing_config_1.TIME_PACKAGES) {
            for (const deviceCount of [1, 2, 3, 4]) {
                table.push(this.calculatePrice({
                    dailyPrice,
                    packageKey: pkgKey,
                    devices: deviceCount,
                }));
            }
        }
        return table;
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)()
], PricingService);
//# sourceMappingURL=pricing.service.js.map