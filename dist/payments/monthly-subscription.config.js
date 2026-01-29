"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONTHLY_SUBSCRIPTION_CONFIG = void 0;
exports.MONTHLY_SUBSCRIPTION_CONFIG = {
    TIER_1: {
        label: 'Starter',
        monthlyFee: 0,
        graceDays: 2,
        description: 'Single router, ideal for small hotspots. No monthly subscription fee.',
    },
    TIER_2: {
        label: 'Growth',
        monthlyFee: 50_000,
        graceDays: 2,
        description: 'Multi-router support with higher capacity for growing ISPs.',
    },
    TIER_3: {
        label: 'Enterprise',
        monthlyFee: 150_000,
        graceDays: 2,
        description: 'Unlimited routers and sessions for large-scale operations.',
    },
};
//# sourceMappingURL=monthly-subscription.config.js.map