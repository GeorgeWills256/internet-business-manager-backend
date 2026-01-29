"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING_CONFIG = void 0;
exports.PRICING_CONFIG = {
    TIER_1: {
        tier: 'TIER_1',
        maxRouters: 1,
        maxLiveSessions: 100,
        monthlySubscriptionFee: 0,
        systemSupportFeePercent: 10,
    },
    TIER_2: {
        tier: 'TIER_2',
        maxRouters: 5,
        maxLiveSessions: 300,
        monthlySubscriptionFee: 50_000,
        systemSupportFeePercent: 8,
    },
    TIER_3: {
        tier: 'TIER_3',
        maxRouters: Infinity,
        maxLiveSessions: Infinity,
        monthlySubscriptionFee: 150_000,
        systemSupportFeePercent: 5,
    },
};
//# sourceMappingURL=pricing.config.js.map