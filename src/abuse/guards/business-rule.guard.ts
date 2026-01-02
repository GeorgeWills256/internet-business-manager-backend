import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AbuseService,
  AbuseAction,
} from '../abuse.service';

/**
 * Optional metadata key for declaring abuse action
 */
export const ABUSE_ACTION_KEY = 'abuse_action';

@Injectable()
export class BusinessRuleGuard implements CanActivate {
  constructor(
    private readonly abuseService: AbuseService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const manager = request.user;

    // If no authenticated manager, let other guards handle it
    if (!manager) return true;

    /**
     * Read action from route metadata
     * Defaults to ACTIVATE_SUBSCRIBER
     */
    const action =
      this.reflector.getAllAndOverride<AbuseAction>(
        ABUSE_ACTION_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? AbuseAction.ACTIVATE_SUBSCRIBER;

    // 🔒 Centralized abuse enforcement
    this.abuseService.assertAllowed(manager, action);

    return true;
  }
}