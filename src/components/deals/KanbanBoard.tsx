'use client';

import type { DealItem, DealStatusSummary } from '@/types/deals';
import { DEAL_STATUS_META, DEAL_STATUS_ORDER } from './dealStatusMeta';
import { KanbanCard } from './KanbanCard';
import styles from './KanbanBoard.module.css';

interface KanbanBoardProps {
  deals: DealItem[];
  summaries: DealStatusSummary[];
}

/** Kanban текущих сделок: только заголовок статуса и карточки, без лишних кнопок */
export function KanbanBoard({ deals, summaries }: KanbanBoardProps) {
  const handleCardClick = (dealId: string) => {
    // TODO: открыть редактирование сделки
    console.log(dealId);
  };

  return (
    <div className={styles.scroll}>
      <div className={styles.board}>
        {DEAL_STATUS_ORDER.map((status) => {
          const meta = DEAL_STATUS_META[status];
          const columnDeals = deals.filter((deal) => deal.status === status);
          const count = summaries.find((summary) => summary.status === status)?.count ?? columnDeals.length;
          return (
            <section key={status} className={styles.column} aria-label={meta.label}>
              <header className={`${styles.columnHeader} ${styles[meta.modifier]}`}>
                <span className={styles.columnTitle}>{meta.label}</span>
                <span className={styles.columnCount}>{count}</span>
              </header>
              {columnDeals.map((deal) => (
                <KanbanCard key={deal.id} deal={deal} onClick={handleCardClick} />
              ))}
              {columnDeals.length === 0 ? <span className={styles.empty}>Нет сделок</span> : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
