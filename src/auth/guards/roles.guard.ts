import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    /**
     * Get required roles from handler or controller
     */
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    /**
     * No roles required → allow access
     */
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    /**
     * Extract authenticated user (from JwtStrategy.validate)
     */
    const request = context.switchToHttp().getRequest();
    const user = request.user as
      | { userId: number; role: Role }
      | undefined;

    if (!user || !user.role) {
      return false;
    }

    /**
     * Role comparison (STRICT & SAFE)
     */
    return requiredRoles.includes(user.role);
  }
}
