import { ChartCard } from '@/components/ui/ChartCard';
import { TurnoverHeader } from '@/components/turnover/TurnoverHeader';
import { TurnoverMetricGrid } from '@/components/turnover/TurnoverMetricGrid';
import { TurnoverDynamicsChart } from '@/components/turnover/TurnoverDynamicsChart';
import { TurnoverStructureChart } from '@/components/turnover/TurnoverStructureChart';
import { CityTurnoverTable } from '@/components/turnover/CityTurnoverTable';
import { CurrencyTurnoverTable } from '@/components/turnover/CurrencyTurnoverTable';
import { OwnerInvestmentsChart } from '@/components/turnover/OwnerInvestmentsChart';
import { OwnerInvestmentsTable } from '@/components/turnover/OwnerInvestmentsTable';
import { OwnerTransactionsTable } from '@/components/turnover/OwnerTransactionsTable';
import { RecentDealsTable } from '@/components/turnover/RecentDealsTable';
import { PeriodSummaryRows } from '@/components/turnover/PeriodSummaryCard';
import { turnoverService } from '@/services';
import styles from './page.module.css';

export default async function TurnoverPage() {
  const data = await turnoverService.getTurnover();
  const totalChangePercent =
    data.metrics.find((metric) => metric.id === 'turnover')?.changePercent ?? 0;

  return (
    <>
      <TurnoverHeader periodLabel={data.periodLabel} cities={data.cities} />

      <TurnoverMetricGrid metrics={data.metrics} />

      <div className={styles.chartsGrid}>
        <ChartCard title="Динамика оборота">
          <TurnoverDynamicsChart points={data.daily} />
        </ChartCard>
        <ChartCard title="Структура оборота">
          <TurnoverStructureChart totalRub={data.structure.totalRub} slices={data.structure.slices} />
        </ChartCard>
      </div>

      <div className={styles.tablesGrid}>
        <ChartCard title="Оборот по городам">
          <CityTurnoverTable rows={data.cityRows} totalChangePercent={totalChangePercent} />
        </ChartCard>
        <ChartCard title="Оборот по валютам">
          <CurrencyTurnoverTable rows={data.currencyRows} />
        </ChartCard>
      </div>

      <div className={styles.ownersGrid}>
        <ChartCard title="Вложения по владельцам" subtitle="Доли в общем капитале">
          <OwnerInvestmentsChart shares={data.ownerShares} />
        </ChartCard>
        <ChartCard title="Текущий оборот по вложениям" subtitle="Текущий период">
          <OwnerInvestmentsTable rows={data.ownerInvestments} />
        </ChartCard>
      </div>

      <div className={styles.transactionsWrap}>
        <OwnerTransactionsTable rows={data.ownerTransactions} />
      </div>

      <div className={styles.bottomGrid}>
        <ChartCard title="Последние сделки">
          <RecentDealsTable rows={data.recentDeals} />
        </ChartCard>
        <ChartCard title="Сводка за период">
          <PeriodSummaryRows summary={data.periodSummary} />
        </ChartCard>
      </div>
    </>
  );
}
