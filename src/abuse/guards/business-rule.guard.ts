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
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const manager = request.user;

    // If no authenticated manager, let other guards handle it
    if (!manager) return true;

    // Try to read declared action metadata first, fallback to request
    const metaAction = this.reflector.getAllAndOverride<AbuseAction>(
      ABUSE_ACTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const action = (metaAction ?? (request.body?.action || request.query?.action || 'default')) as AbuseAction;

    // Return boolean (non-throwing) result from AbuseService
    return this.abuseService.isAllowed(manager, action);
  }
}