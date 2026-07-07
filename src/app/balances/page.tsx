import { BalancesView } from '@/components/balances/BalancesView';
import { balancesService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';

export default async function BalancesPage() {
  await requireRouteAccess('/balances');
  const snapshot = await balancesService.getSnapshot();

  return <BalancesView snapshot={snapshot} />;
}
