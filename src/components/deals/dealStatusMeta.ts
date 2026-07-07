import type { IconName } from '@/components/ui/Icon';
import type { DealStatus } from '@/types/domain';

/**
 * Визуальная мета статусов сделки: подпись, иконка и модификатор
 * для CSS-классов тонировки (fixed/waiting/check/done/alert).
 */
export const DEAL_STATUS_META: Record<
  DealStatus,
  { label: string; icon: IconName; modifier: 'fixed' | 'waiting' | 'check' | 'done' | 'alert' }
> = {
  fixed: { label: 'Фикс с клиентом', icon: 'deals', modifier: 'fixed' },
  awaiting_payment: { label: 'Ожидание оплаты', icon: 'clock', modifier: 'waiting' },
  balance_check: { label: 'Сверка баланса', icon: 'scale', modifier: 'check' },
  completed: { label: 'Сделка завершена', icon: 'check-circle', modifier: 'done' },
  insufficient_usdt: { label: 'Недостаточно USDT', icon: 'alert', modifier: 'alert' },
};

/** Порядок статусов в сводке и на kanban-доске */
export const DEAL_STATUS_ORDER: DealStatus[] = [
  'fixed',
  'awaiting_payment',
  'balance_check',
  'completed',
  'insufficient_usdt',
];
