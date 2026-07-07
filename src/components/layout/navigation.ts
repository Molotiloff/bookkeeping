import type { IconName } from '@/components/ui/Icon';
import type { UserRole } from '@/types/domain';

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  /** Роли, которым виден пункт. По ТЗ кассир и менеджер не видят отчёты и статистику. */
  roles: UserRole[];
}

const ALL: UserRole[] = ['admin', 'manager', 'cashier'];
const ADMIN_ONLY: UserRole[] = ['admin'];

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Главная', icon: 'home', roles: ALL },
  { href: '/deals', label: 'Сделки', icon: 'deals', roles: ALL },
  { href: '/clients', label: 'Клиенты', icon: 'clients', roles: ALL },
  { href: '/balances', label: 'Балансы', icon: 'wallet', roles: ALL },
  { href: '/accounting', label: 'Бухгалтерия', icon: 'accounting', roles: ADMIN_ONLY },
  { href: '/cash', label: 'Кассы', icon: 'cash', roles: ALL },
  { href: '/expenses', label: 'Расходы', icon: 'expenses', roles: ALL },
  { href: '/attendance', label: 'Посещаемость', icon: 'attendance', roles: ALL },
  { href: '/turnover', label: 'Оборот', icon: 'pie', roles: ALL },
  { href: '/income', label: 'Доходы', icon: 'income', roles: ADMIN_ONLY },
  { href: '/reports', label: 'Отчёты', icon: 'reports', roles: ADMIN_ONLY },
  { href: '/settings', label: 'Настройки', icon: 'settings', roles: ALL },
];

export function navItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
