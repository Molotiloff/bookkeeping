import { Header } from '@/components/layout/Header';
import { ChartCard } from '@/components/ui/ChartCard';
import { CashDesksGrid } from '@/components/accounting/CashDesksGrid';
import { TransfersList } from '@/components/accounting/TransfersList';
import { PnLCard } from '@/components/accounting/PnLCard';
import { accountingService } from '@/services';
import styles from './page.module.css';

export default async function AccountingPage() {
  const [desks, transfers, pnl] = await Promise.all([
    accountingService.getCashDesks(),
    accountingService.getTransfers(),
    accountingService.getPnL(),
  ]);

  return (
    <>
      <Header
        title="Бухгалтерия"
        subtitle="Кассы, перемещения и P&L"
        period={pnl.periodLabel}
        hasUnread
      />

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
