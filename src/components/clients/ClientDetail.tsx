import type { Client } from '@/types/domain';
import { formatMoney, formatRub, formatRubCompact } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { GroupBadge } from './GroupBadge';
import styles from './ClientDetail.module.css';

/** Карточка клиента: балансы, прибыль, Telegram-связка, история сделок */
export function ClientDetail({ client }: { client: Client }) {
  return (
    <div className={styles.detail}>
      <header className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          {client.name.slice(0, 1)}
        </span>
        <div className={styles.headInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{client.name}</h3>
            <GroupBadge group={client.group} />
          </div>
          <span className={styles.telegram}>
            {client.telegramChatName} · chat_id {client.telegramChatId}
          </span>
        </div>
      </header>

      <div className={styles.balances}>
        {client.balances.map((balance) => (
          <span key={balance.currency} className={styles.balanceChip}>
            <span className={styles.balanceCurrency}>{balance.currency}</span>
            {formatMoney(balance)}
          </span>
        ))}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Прибыль по клиенту</span>
          <span className={`${styles.statValue} ${styles.statProfit}`}>
            {formatRubCompact(client.profitRub)}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Всего сделок</span>
          <span className={styles.statValue}>{client.dealsCount}</span>
        </div>
      </div>

      <h4 className={styles.historyTitle}>История сделок</h4>
      <ul className={styles.history}>
        {client.recentDeals.map((deal) => (
          <li key={deal.id} className={styles.historyItem}>
            <span
              className={`${styles.historyIcon} ${
                deal.outcome === 'completed' ? styles.iconDone : styles.iconCancelled
              }`}
            >
              <Icon name={deal.outcome === 'completed' ? 'check' : 'alert'} size={13} />
            </span>
            <span className={styles.historyBody}>
              <span className={styles.historyOp}>
                {deal.id} · {deal.operation}
              </span>
              <span className={styles.historyDate}>{deal.completedAt}</span>
            </span>
            <span className={styles.historyAmounts}>
              <span className={styles.historyAmount}>{formatRub(deal.amountRub)}</span>
              {deal.profitRub > 0 ? (
                <span className={styles.historyProfit}>+{formatRub(deal.profitRub)}</span>
              ) : (
                <span className={styles.historyDate}>отменена</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
