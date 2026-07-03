import type { Deal } from '@/types/domain';
import { formatMinutesAgo, formatRub } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import styles from './DealsTable.module.css';

export function DealsTable({ deals }: { deals: Deal[] }) {
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID сделки</th>
            <th>Клиент</th>
            <th>Направление</th>
            <th className={styles.amountHead}>Сумма</th>
            <th>Статус</th>
            <th>Обновлено</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id}>
              <td className={styles.dealId}>{deal.id}</td>
              <td>{deal.clientName}</td>
              <td className={styles.operation}>
                {deal.operation}
                {deal.tronscanUrl ? (
                  <a
                    href={deal.tronscanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.txLink}
                    aria-label={`Транзакция сделки ${deal.id} в Tronscan`}
                    title="Открыть в Tronscan"
                  >
                    <Icon name="external" size={13} />
                  </a>
                ) : null}
              </td>
              <td className={styles.amount}>{formatRub(deal.amountRub)}</td>
              <td>
                <StatusBadge status={deal.status} />
              </td>
              <td className={styles.updated}>{formatMinutesAgo(deal.updatedMinutesAgo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
