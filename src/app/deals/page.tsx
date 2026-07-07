import { DealsView } from '@/components/deals/DealsView';
import { dealsService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';

export default async function DealsPage() {
  await requireRouteAccess('/deals');
  const data = await dealsService.getDealsPage();

  return <DealsView data={data} />;
}
