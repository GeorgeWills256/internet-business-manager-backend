export type ManagerTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export const PRICING_CONFIG = {
  TIER_1: {
    tier: 'TIER_1' as const,

    // Capacity limits (already enforced elsewhere)
    maxRouters: 1,
    maxLiveSessions: 100,

    // 🔐 FIXED MONTHLY PAYMENT (IBM usage)
    monthlySubscriptionFee: 0, // UGX

    // 🔄 VARIABLE PER-SALE DEDUCTION
    systemSupportFeePercent: 10,
  },

  TIER_2: {
    tier: 'TIER_2' as const,

    maxRouters: 5,
    maxLiveSessions: 300,

    monthlySubscriptionFee: 50_000, // UGX
    systemSupportFeePercent: 8,
  },

  TIER_3: {
    tier: 'TIER_3' as const,

    maxRouters: Infinity,
    maxLiveSessions: Infinity,

    monthlySubscriptionFee: 150_000, // UGX
    systemSupportFeePercent: 5,
  },
} as const;
