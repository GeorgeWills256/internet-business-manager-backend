export type ManagerTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export const TIER_LIMITS: Record<
  ManagerTier,
  {
    maxLiveSessions: number;
    maxSalespeople: number;
    maxRouters: number;
  }
> = {
  TIER_1: {
    maxLiveSessions: 100,
    maxSalespeople: 1,
    maxRouters: 1,
  },
  TIER_2: {
    maxLiveSessions: 300,
    maxSalespeople: 3,
    maxRouters: 3,
  },
  TIER_3: {
    maxLiveSessions: 1000,
    maxSalespeople: 10,
    maxRouters: 10,
  },
};
