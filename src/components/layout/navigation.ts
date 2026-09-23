import type { IconName } from '@/components/ui/Icon';
import type { UserRole } from '@/types/domain';
import { routeAccess, type RouteKey } from '@/lib/accessPolicy';

export interface NavItem {
  href: RouteKey;
  label: string;
  icon: IconName;
  /** Роли, которым виден пункт навигации. */
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Главная', icon: 'home', roles: [...routeAccess['/']] },
  { href: '/deals', label: 'Сделки', icon: 'deals', roles: [...routeAccess['/deals']] },
  { href: '/clients', label: 'Клиенты', icon: 'clients', roles: [...routeAccess['/clients']] },
  { href: '/balances', label: 'Балансы', icon: 'wallet', roles: [...routeAccess['/balances']] },
  { href: '/accounting', label: 'Бухгалтерия', icon: 'accounting', roles: [...routeAccess['/accounting']] },
  { href: '/expenses', label: 'Расходы', icon: 'expenses', roles: [...routeAccess['/expenses']] },
  { href: '/attendance', label: 'Посещаемость', icon: 'attendance', roles: [...routeAccess['/attendance']] },
  { href: '/turnover', label: 'Оборот', icon: 'pie', roles: [...routeAccess['/turnover']] },
];

export function navItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
