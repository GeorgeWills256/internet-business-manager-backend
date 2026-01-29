import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used by RolesGuard
 */
export const ROLES_KEY = 'roles';

/**
 * System roles (STANDARDIZED — lowercase)
 */
export type Role = 'admin' | 'manager' | 'salesperson';

/**
 * Roles decorator
 * Usage: @Roles('admin')
 */
export const Roles = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);
