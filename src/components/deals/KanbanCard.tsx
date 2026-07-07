'use client';

import Link from 'next/link';
import type { DealItem } from '@/types/deals';
import { dealOperation } from '@/types/deals';
import { formatRub } from '@/lib/format';
import styles from './KanbanBoard.module.css';

interface KanbanCardProps {
  deal: DealItem;
  onClick: (dealId: string) => void;
}

export function KanbanCard({ deal, onClick }: KanbanCardProps) {
  return (
    <Link
      href={`/deals/${encodeURIComponent(deal.id)}`}
      className={styles.card}
      onClick={() => onClick(deal.id)}
    >
      <span className={styles.cardTop}>
        <span className={styles.cardId}>{deal.id}</span>
        <span className={styles.cardClient}>{deal.clientShortName}</span>
      </span>
      <span className={styles.cardOperation}>{dealOperation(deal)}</span>
      {deal.insufficientUsdt ? <span className={styles.cardOperation}>Недостаточно USDT</span> : null}
      <span className={styles.cardAmount}>{formatRub(deal.amountRub)}</span>
      <span className={styles.cardFooter}>
        <span>{deal.city}</span>
        <span>{deal.updatedLabel}</span>
      </span>
    </Link>
  );
}
