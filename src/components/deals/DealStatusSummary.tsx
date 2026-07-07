import type { DealStatusSummary } from '@/types/deals';
import { formatRub } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { DEAL_STATUS_META } from './dealStatusMeta';
import styles from './DealStatusSummary.module.css';

export function DealStatusSummaryGrid({ summaries }: { summaries: DealStatusSummary[] }) {
  return (
    <div className={styles.grid}>
      {summaries.map((summary) => {
        const meta = DEAL_STATUS_META[summary.status];
        return (
          <article key={summary.status} className={styles.card}>
            <div className={styles.head}>
              <span className={`${styles.iconWrap} ${styles[meta.modifier]}`}>
                <Icon name={meta.icon} size={14} />
              </span>
              <span className={styles.label}>{meta.label}</span>
            </div>
            <span className={styles.count}>{summary.count}</span>
            <span className={styles.sum}>
              {summary.totalRub === null ? '—' : formatRub(summary.totalRub)}
            </span>
          </article>
        );
      })}
    </div>
  );
}
