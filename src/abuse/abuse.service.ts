import { Injectable, ForbiddenException } from '@nestjs/common';
import { Manager } from '../entities/manager.entity';
import { ABUSE_LIMITS } from './constants/abuse-limits';

/**
 * Actions that may trigger abuse checks
 */
export enum AbuseAction {
  ISSUE_FREE_CODE = 'ISSUE_FREE_CODE',
  ACTIVATE_SUBSCRIBER = 'ACTIVATE_SUBSCRIBER',
  RECEIVE_PAYMENT = 'RECEIVE_PAYMENT',
}

@Injectable()
export class AbuseService {
  /**
   * =========================
   * CENTRAL ABUSE GATEKEEPER
   * =========================
   * Call this BEFORE sensitive actions
   */
  assertAllowed(manager: Manager, action: AbuseAction): void {
    this.checkSuspension(manager);
    this.checkFreeCodeLimit(manager, action);
  }

  /**
   * Non-throwing helper that returns whether the action is allowed.
   * Returns `true` when allowed, `false` when a ForbiddenException would
   * have been thrown by `assertAllowed`. Any other exception bubbles up.
   */
  isAllowed(manager: Manager, action: AbuseAction): boolean {
    try {
      this.assertAllowed(manager, action);
      return true;
    } catch (err) {
      if (err instanceof ForbiddenException) return false;
      throw err;
    }
  }

  /**
   * =========================
   * SUSPENSION CHECK
   * =========================
   * Manual or automatic admin suspension
   */
  private checkSuspension(manager: Manager): void {
    if (manager.isSuspended) {
      // Auto-unsuspend if suspension expired
      if (
        manager.suspendedUntil &&
        manager.suspendedUntil < new Date()
      ) {
        manager.isSuspended = false;
        manager.suspendedUntil = null;
        manager.suspensionReason = null;
        return;
      }

      throw new ForbiddenException(
        manager.suspensionReason ||
          'Account suspended. Contact support.',
      );
    }
  }

  /**
   * =========================
   * FREE CODE ABUSE LIMIT
   * =========================
   */
  private checkFreeCodeLimit(
    manager: Manager,
    action: AbuseAction,
  ): void {
    if (action !== AbuseAction.ISSUE_FREE_CODE) return;

    if (
      manager.freeCodesIssuedToday >=
      ABUSE_LIMITS.FREE_CODES_PER_DAY
    ) {
      throw new ForbiddenException(
        'Daily free code limit reached',
      );
    }
  }
}