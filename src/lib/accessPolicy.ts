import type { UserRole } from '@/types/domain';

export type RouteKey =
  | '/'
  | '/deals'
  | '/clients'
  | '/balances'
  | '/accounting'
  | '/expenses'
  | '/attendance'
  | '/turnover';

export const ROLES = {
  all: ['admin', 'owner', 'accountant', 'manager', 'cashier'],
  managerPlus: ['admin', 'owner', 'accountant', 'manager'],
  accountantPlus: ['admin', 'owner', 'accountant'],
  ownerPlus: ['admin', 'owner'],
  adminOnly: ['admin'],
} as const satisfies Record<string, readonly UserRole[]>;

export const routeAccess: Record<RouteKey, readonly UserRole[]> = {
  '/': ROLES.all,
  '/deals': ROLES.all,
  '/clients': ROLES.all,
  '/balances': ROLES.all,
  '/accounting': ROLES.accountantPlus,
  '/expenses': ROLES.managerPlus,
  '/attendance': ROLES.managerPlus,
  '/turnover': ROLES.ownerPlus,
};

export function canAccessRoute(role: UserRole, route: RouteKey): boolean {
  return routeAccess[route].includes(role);
}
