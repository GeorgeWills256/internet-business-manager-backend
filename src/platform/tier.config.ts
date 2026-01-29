export type ManagerTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export const TIER_LIMITS = {
  TIER_1: {
    maxRouters: 1,
    maxConcurrentSessionsPerRouter: 30,
    platformFeePercent: 10,
  },

  TIER_2: {
    maxRouters: 3,
    maxConcurrentSessionsPerRouter: 50,
    platformFeePercent: 8,
  },

  TIER_3: {
    maxRouters: 10,
    maxConcurrentSessionsPerRouter: 80,
    platformFeePercent: 5,
  },
} as const;
