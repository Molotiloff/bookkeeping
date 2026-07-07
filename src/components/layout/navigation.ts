import type { IconName } from '@/components/ui/Icon';
import type { UserRole } from '@/types/domain';
import { ROLES } from '@/lib/accessPolicy';

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  /** Роли, которым виден пункт. По ТЗ кассир и менеджер не видят отчёты и статистику. */
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Главная', icon: 'home', roles: [...ROLES.all] },
  { href: '/deals', label: 'Сделки', icon: 'deals', roles: [...ROLES.all] },
  { href: '/clients', label: 'Клиенты', icon: 'clients', roles: [...ROLES.all] },
  { href: '/balances', label: 'Балансы', icon: 'wallet', roles: [...ROLES.all] },
  { href: '/accounting', label: 'Бухгалтерия', icon: 'accounting', roles: [...ROLES.accountantPlus] },
  { href: '/expenses', label: 'Расходы', icon: 'expenses', roles: [...ROLES.managerPlus] },
  { href: '/attendance', label: 'Посещаемость', icon: 'attendance', roles: [...ROLES.managerPlus] },
  { href: '/turnover', label: 'Оборот', icon: 'pie', roles: [...ROLES.ownerPlus] },
];

export function navItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
