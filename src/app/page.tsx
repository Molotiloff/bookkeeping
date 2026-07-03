import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { DealsTable } from '@/components/dashboard/DealsTable';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { ProfitLineChart } from '@/components/charts/ProfitLineChart';
import { DealsDonut } from '@/components/charts/DealsDonut';
import {
  chartDataService,
  dealsService,
  notificationsService,
  statsService,
} from '@/services';
import styles from './page.module.css';

export default async function DashboardPage() {
  const [kpiStats, deals, profitPoints, dealStructure, notifications] = await Promise.all([
    statsService.getKpiStats(),
    dealsService.getActiveDeals(),
    chartDataService.getProfitDynamics(),
    chartDataService.getDealStructure(),
    notificationsService.getRecent(),
  ]);

  return (
    <>
      <Header
        title="Главная"
        subtitle="Сводная статистика"
        period="01.05.2024 – 31.05.2024"
        hasUnread
      />

      <div className={styles.kpiGrid}>
        {kpiStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className={styles.analyticsGrid}>
        <ChartCard title="Динамика прибыли" subtitle="По дням">
          <ProfitLineChart points={profitPoints} />
        </ChartCard>
        <ChartCard title="Структура сделок" subtitle="Все направления за период">
          <DealsDonut structure={dealStructure} />
        </ChartCard>
      </div>

      <div className={styles.bottomGrid}>
        <ChartCard
          title="Активные сделки"
          subtitle={`В работе: ${deals.length}`}
        >
          <DealsTable deals={deals} />
        </ChartCard>
        <ChartCard title="Уведомления">
          <NotificationsPanel notifications={notifications} />
        </ChartCard>
      </div>
    </>
  );
}
