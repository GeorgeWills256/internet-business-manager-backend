/**
 * ==========================================
 * MONTHLY SUBSCRIPTION CONFIGURATION
 * ==========================================
 * Applies ONLY to monthly subscription fees
 * (NOT system support fee % from sales)
 *
 * Enforcement model:
 * - Auto debit on last day of month @ 12:00 PM
 * - 2-day grace window
 * - Block AFTER grace expiry
 */

export type PlatformTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export const MONTHLY_SUBSCRIPTION_CONFIG: Record<
  PlatformTier,
  {
    label: string;
    monthlyFee: number; // UGX
    graceDays: number;
    description: string;
  }
> = {
  TIER_1: {
    label: 'Starter',
    monthlyFee: 0,
    graceDays: 2,
    description:
      'Single router, ideal for small hotspots. No monthly subscription fee.',
  },

  TIER_2: {
    label: 'Growth',
    monthlyFee: 50_000,
    graceDays: 2,
    description:
      'Multi-router support with higher capacity for growing ISPs.',
  },

  TIER_3: {
    label: 'Enterprise',
    monthlyFee: 150_000,
    graceDays: 2,
    description:
      'Unlimited routers and sessions for large-scale operations.',
  },
};