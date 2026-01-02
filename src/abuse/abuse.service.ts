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
    this.checkGracePeriod(manager, action);
    this.checkFreeCodeLimit(manager, action);
  }

  /**
   * =========================
   * SUSPENSION CHECK
   * =========================
   */
  public checkSuspension(manager: Manager): void {
    if (manager.isSuspended) {
      throw new ForbiddenException(
        manager.suspensionReason ||
          'Account suspended. Contact support.',
      );
    }

    // Auto-unsuspend if suspension expired
    if (
      manager.suspendedUntil &&
      new Date(manager.suspendedUntil) < new Date()
    ) {
      manager.isSuspended = false;
      manager.suspendedUntil = null;
      manager.suspensionReason = null;
    }
  }

  /**
   * =========================
   * GRACE PERIOD CHECK
   * =========================
   */
  public checkGracePeriod(
    manager: Manager,
    action: AbuseAction,
  ): void {
    // Payments are always allowed
    if (action === AbuseAction.RECEIVE_PAYMENT) return;

    if (
      manager.pendingGraceExpiry &&
      new Date(manager.pendingGraceExpiry) < new Date()
    ) {
      throw new ForbiddenException(
        'Grace period expired. Payment required.',
      );
    }
  }

  /**
   * =========================
   * FREE CODE LIMIT CHECK
   * =========================
   */
  public checkFreeCodeLimit(
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