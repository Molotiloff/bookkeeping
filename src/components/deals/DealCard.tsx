import type { Deal } from '@/types/domain';
import { formatMinutesAgo, formatRub } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import styles from './DealCard.module.css';

/** Карточка сделки на kanban-доске */
export function DealCard({ deal }: { deal: Deal }) {
  const isAlert = deal.status === 'insufficient_usdt';

  return (
    <article className={`${styles.card} ${isAlert ? styles.cardAlert : ''}`}>
      <header className={styles.top}>
        <span className={styles.id}>{deal.id}</span>
        <time className={styles.time}>{formatMinutesAgo(deal.updatedMinutesAgo)}</time>
      </header>

      <span className={styles.client}>{deal.clientName}</span>
      <span className={styles.operation}>
        {deal.operation}
        {deal.assetAmount ? ` · ${deal.assetAmount}` : ''}
      </span>

      <footer className={styles.bottom}>
        <span className={styles.amount}>{formatRub(deal.amountRub)}</span>
        {deal.rate ? (
          <span className={styles.rate}>курс {deal.rate.toLocaleString('ru-RU')}</span>
        ) : null}
      </footer>

      {isAlert ? (
        <button type="button" className={styles.alertAction}>
          <Icon name="alert" size={13} />
          Вывести в чат заявок
        </button>
      ) : null}

      {deal.tronscanUrl ? (
        <a
          href={deal.tronscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.txLink}
        >
          <Icon name="external" size={13} />
          Tronscan
        </a>
      ) : null}
    </article>
  );
}
