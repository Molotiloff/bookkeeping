import type { DealHistoryItem } from '@/types/domain';
import { formatRub } from '@/lib/format';
import styles from './DealsHistory.module.css';

/** История сделок за период (по ТЗ — с фильтром; в демо фильтр статичен) */
export function DealsHistory({ items }: { items: DealHistoryItem[] }) {
  return (
    <div>
      <div className={styles.filters}>
        <button type="button" className={`${styles.chip} ${styles.chipActive}`}>Неделя</button>
        <button type="button" className={styles.chip}>Месяц</button>
        <button type="button" className={styles.chip}>Период…</button>
      </div>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Направление</th>
              <th className={styles.num}>Сумма</th>
              <th className={styles.num}>Прибыль</th>
              <th>Дата</th>
              <th>Итог</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className={styles.id}>{item.id}</td>
                <td>{item.clientName}</td>
                <td>{item.operation}</td>
                <td className={styles.amount}>{formatRub(item.amountRub)}</td>
                <td className={`${styles.amount} ${item.profitRub > 0 ? styles.profit : ''}`}>
                  {item.profitRub > 0 ? `+${formatRub(item.profitRub)}` : '—'}
                </td>
                <td className={styles.date}>{item.completedAt}</td>
                <td>
                  <span
                    className={`${styles.outcome} ${
                      item.outcome === 'completed' ? styles.outcomeDone : styles.outcomeCancelled
                    }`}
                  >
                    {item.outcome === 'completed' ? 'Завершена' : 'Отменена'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
