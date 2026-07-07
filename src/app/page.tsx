import { MainHeader } from '@/components/main/MainHeader';
import { TopMetricsGrid } from '@/components/main/TopMetricsGrid';
import { DailyIndicatorsCard } from '@/components/main/DailyIndicatorsCard';
import { CurrenciesPanel } from '@/components/main/CurrenciesPanel';
import { FinancePanel } from '@/components/main/FinancePanel';
import { CitySummariesGrid } from '@/components/main/CitySummariesGrid';
import { SystemMetricsSection } from '@/components/main/SystemMetricsSection';
import { DashboardFooter } from '@/components/main/DashboardFooter';
import { mainDashboardService } from '@/services';
import styles from './page.module.css';

export default async function MainPage() {
  const data = await mainDashboardService.getDashboard();

  return (
    <>
      <MainHeader
        dateLabel={data.dateLabel}
        weekdayLabel={data.weekdayLabel}
        cities={data.cities}
      />

      <TopMetricsGrid metrics={data.topMetrics} />

      <div className={styles.mainGrid}>
        <DailyIndicatorsCard indicators={data.dailyIndicators} />
        <CurrenciesPanel currencies={data.currencies} />
        <FinancePanel indicators={data.finance} />
      </div>

      <CitySummariesGrid summaries={data.citySummaries} />
      <SystemMetricsSection metrics={data.systemMetrics} />
      <DashboardFooter lastUpdatedLabel={data.lastUpdatedLabel} />
    </>
  );
}
