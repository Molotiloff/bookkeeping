import type { DealStatus } from '@/types/domain';
import styles from './StatusBadge.module.css';

/**
 * Конфигурация статусов (Open/Closed): новый статус добавляется
 * записью в map без изменения разметки компонента.
 */
const STATUS_CONFIG: Record<DealStatus, { label: string; className: string; alert?: boolean }> = {
  fixed: { label: 'Фикс с клиентом', className: styles.fixed },
  awaiting_payment: { label: 'Ожидание оплаты', className: styles.waiting },
  balance_check: { label: 'Сверка баланса', className: styles.check },
  completed: { label: 'Сделка завершена', className: styles.done },
  insufficient_usdt: { label: 'Недостаточно USDT', className: styles.alert, alert: true },
};

export function StatusBadge({ status }: { status: DealStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`${styles.badge} ${config.className}`}>
      <span className={styles.dot} aria-hidden="true" />
      {config.label}
    </span>
  );
}
