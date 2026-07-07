import { Header } from '@/components/layout/Header';
import { ChartCard } from '@/components/ui/ChartCard';
import { CashDesksGrid } from '@/components/accounting/CashDesksGrid';
import { TransfersList } from '@/components/accounting/TransfersList';
import { PnLCard } from '@/components/accounting/PnLCard';
import { ProfitLineChart } from '@/components/charts/ProfitLineChart';
import { DealsDonut } from '@/components/charts/DealsDonut';
import { accountingService, chartDataService } from '@/services';
import styles from './page.module.css';

export default async function AccountingPage() {
  const [desks, transfers, pnl, profitPoints, dealStructure] = await Promise.all([
    accountingService.getCashDesks(),
    accountingService.getTransfers(),
    accountingService.getPnL(),
    chartDataService.getProfitDynamics(),
    chartDataService.getDealStructure(),
  ]);

  return (
    <>
      <Header
        title="Бухгалтерия"
        subtitle="Кассы, перемещения и P&L"
        period={pnl.periodLabel}
        hasUnread
      />

      {/* Аналитика прибыли перенесена сюда с главной страницы */}
      <div className={styles.analyticsGrid}>
        <ChartCard title="Динамика прибыли" subtitle="По дням">
          <ProfitLineChart points={profitPoints} />
        </ChartCard>
        <ChartCard title="Структура сделок" subtitle="Все направления за период">
          <DealsDonut structure={dealStructure} />
        </ChartCard>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          <ChartCard title="Кассы" subtitle="По городам и валютам">
            <CashDesksGrid desks={desks} />
          </ChartCard>
          <ChartCard title="Перемещения между кассами" subtitle="Последние операции">
            <TransfersList transfers={transfers} />
          </ChartCard>
        </div>

        <ChartCard title="P&L за период" subtitle={pnl.periodLabel}>
          <PnLCard report={pnl} />
        </ChartCard>
      </div>
    </>
  );
}
