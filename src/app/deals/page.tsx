import { Header } from '@/components/layout/Header';
import { ChartCard } from '@/components/ui/ChartCard';
import { DealsBoard } from '@/components/deals/DealsBoard';
import { DealsHistory } from '@/components/deals/DealsHistory';
import { dealsService } from '@/services';
import styles from './page.module.css';

export default async function DealsPage() {
  const [deals, history] = await Promise.all([
    dealsService.getActiveDeals(),
    dealsService.getHistory(),
  ]);

  return (
    <>
      <Header
        title="Сделки"
        subtitle="Дашборд активных сделок"
        period="01.05.2024 – 31.05.2024"
        hasUnread
      />

      <div className={styles.boardWrap}>
        <DealsBoard deals={deals} />
      </div>

      <ChartCard title="История за период" subtitle="Завершённые и отменённые заявки">
        <DealsHistory items={history} />
      </ChartCard>
    </>
  );
}
