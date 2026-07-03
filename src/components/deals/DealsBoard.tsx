import type { Deal, DealStatus } from '@/types/domain';
import { formatRubCompact } from '@/lib/format';
import { DealCard } from './DealCard';
import styles from './DealsBoard.module.css';

/** Порядок и подписи колонок доски (Open/Closed: новая колонка — новая запись) */
const COLUMNS: { status: DealStatus; label: string; toneClass: string }[] = [
  { status: 'fixed', label: 'Фикс с клиентом', toneClass: styles.toneFixed },
  { status: 'balance_check', label: 'Сверка баланса', toneClass: styles.toneCheck },
  { status: 'awaiting_payment', label: 'Ожидание оплаты', toneClass: styles.toneWaiting },
  { status: 'insufficient_usdt', label: 'Недостаточно USDT', toneClass: styles.toneAlert },
  { status: 'completed', label: 'Сделка завершена', toneClass: styles.toneDone },
];

export function DealsBoard({ deals }: { deals: Deal[] }) {
  return (
    <div className={styles.scroll}>
      <div className={styles.board}>
        {COLUMNS.map((column) => {
          const columnDeals = deals.filter((deal) => deal.status === column.status);
          const totalRub = columnDeals.reduce((sum, deal) => sum + deal.amountRub, 0);
          return (
            <section key={column.status} className={styles.column}>
              <header className={`${styles.columnHeader} ${column.toneClass}`}>
                <span className={styles.columnTitle}>{column.label}</span>
                <span className={styles.columnCount}>{columnDeals.length}</span>
              </header>
              <span className={styles.columnSum}>{formatRubCompact(totalRub)}</span>
              <div className={styles.cards}>
                {columnDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
                {columnDeals.length === 0 ? (
                  <span className={styles.empty}>Нет заявок</span>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
