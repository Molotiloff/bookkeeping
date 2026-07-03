import type { KpiStat } from '@/types/domain';
import { formatPercentChange, formatRubCompact } from '@/lib/format';
import { Icon, type IconName } from './Icon';
import styles from './StatCard.module.css';

const KPI_VISUALS: Record<KpiStat['id'], { icon: IconName; tone: string }> = {
  cash_balance: { icon: 'wallet', tone: styles.tone1 },
  city_balance: { icon: 'building', tone: styles.tone2 },
  profit_day: { icon: 'trend-up', tone: styles.tone3 },
  profit_month: { icon: 'coins', tone: styles.tone4 },
};

export function StatCard({ stat }: { stat: KpiStat }) {
  const { icon, tone } = KPI_VISUALS[stat.id];
  const isUp = stat.changePercent >= 0;

  return (
    <article className={styles.card}>
      <span className={`${styles.iconWrap} ${tone}`}>
        <Icon name={icon} size={20} />
      </span>
      <div className={styles.body}>
        <span className={styles.label}>{stat.label}</span>
        <span className={styles.amount}>{formatRubCompact(stat.amountRub)}</span>
      </div>
      <span className={`${styles.delta} ${isUp ? styles.deltaUp : styles.deltaDown}`}>
        {formatPercentChange(stat.changePercent)}
      </span>
    </article>
  );
}
