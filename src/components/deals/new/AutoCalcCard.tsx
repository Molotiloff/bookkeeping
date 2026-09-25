import { InfoAlert } from '@/components/ui/InfoAlert';
import type { CalcRow } from './newDealConfig';
import styles from './AutoCalcCard.module.css';

export function AutoCalcCard({ rows, showRateNotice = true }: { rows: CalcRow[]; showRateNotice?: boolean }) {
  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>Авто расчёт</h2>

      <dl className={styles.rows}>
        {rows.map((row) => (
          <div key={row.key} className={styles.row}>
            <dt className={styles.rowLabel}>{row.label}</dt>
            <dd
              className={`${styles.rowValue} ${
                row.tone === 'up' ? styles.up : row.tone === 'down' ? styles.down : ''
              }`}
            >
              {row.tone === 'up' && row.value > 0 ? `+${row.text}` : row.text}
            </dd>
          </div>
        ))}
      </dl>

      {showRateNotice ? <div className={styles.alertWrap}>
        <InfoAlert>
          Курс компании берётся с главной страницы и фиксируется при создании сделки.
        </InfoAlert>
      </div> : null}
    </section>
  );
}
