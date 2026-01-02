import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used by RolesGuard
 */
export const ROLES_KEY = 'roles';

/**
 * System roles
 * - admin: system owner
 * - manager: internet business owner
 * - salesperson: delegated sales user
 */
export type Role = 'admin' | 'manager' | 'salesperson';

/**
 * Roles decorator
 * Usage: @Roles('admin')
 */
export const Roles = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);
