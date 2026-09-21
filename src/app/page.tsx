import { randomUUID } from 'node:crypto';
import { MainHeader } from '@/components/main/MainHeader';
import { TopMetricsGrid } from '@/components/main/TopMetricsGrid';
import { DailyIndicatorsCard } from '@/components/main/DailyIndicatorsCard';
import { CurrenciesPanel } from '@/components/main/CurrenciesPanel';
import { FinancePanel } from '@/components/main/FinancePanel';
import { CitySummariesGrid } from '@/components/main/CitySummariesGrid';
import { SystemMetricsSection } from '@/components/main/SystemMetricsSection';
import { DashboardFooter } from '@/components/main/DashboardFooter';
import { mainDashboardService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';
import styles from './page.module.css';
import { ManualCashPanel } from '@/components/main/ManualCashPanel';
import { ShadowReportPanel } from '@/components/main/ShadowReportPanel';

export default async function MainPage() {
  const user = await requireRouteAccess('/');
  const data = await mainDashboardService.getDashboard();
  const [manualCash, shadowReport] = await Promise.all([
    mainDashboardService.getManualCash(),
    loadShadowReport(data.shadowComparison?.reportId),
  ]);

  return (
    <>
      <MainHeader
        dateLabel={data.dateLabel}
        weekdayLabel={data.weekdayLabel}
      />

      <ShadowReportPanel
        source={data.source}
        comparison={data.shadowComparison}
        warnings={data.warnings}
        report={shadowReport}
      />

      <TopMetricsGrid metrics={data.topMetrics} />

      <div className={styles.mainGrid}>
        <DailyIndicatorsCard indicators={data.dailyIndicators} />
        <CurrenciesPanel currencies={data.currencies} />
      </div>

      <div className={styles.financeBlock}>
        <FinancePanel indicators={data.finance} />
      </div>

      <CitySummariesGrid summaries={data.citySummaries} />
      <ManualCashPanel
        snapshot={manualCash}
        today={dateInputValue(data.dateLabel)}
        submissionKey={`crm:${randomUUID()}`}
        canEdit={['accountant', 'owner', 'admin'].includes(user.role)}
      />
      <SystemMetricsSection metrics={data.systemMetrics} />
      <DashboardFooter lastUpdatedLabel={data.lastUpdatedLabel} />
    </>
  );
}

function dateInputValue(value: string): string {
  const [day, month, year] = value.split('.');
  return `${year}-${month}-${day}`;
}

async function loadShadowReport(reportId?: number) {
  if (!reportId) return null;
  try {
    return await mainDashboardService.getShadowReport(reportId);
  } catch {
    return null;
  }
}
