import { BalancesView } from '@/components/balances/BalancesView';
import { balancesService } from '@/services';

export default async function BalancesPage() {
  const snapshot = await balancesService.getSnapshot();

  return <BalancesView snapshot={snapshot} />;
}
