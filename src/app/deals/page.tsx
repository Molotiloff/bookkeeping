import { DealsView } from '@/components/deals/DealsView';
import { dealsService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';
import { canManageDeals } from '@/lib/dealManagement';
import { FulfillmentQueuePanel } from '@/components/deals/FulfillmentQueuePanel';

export default async function DealsPage() {
  const user = await requireRouteAccess('/deals');
  const data = await dealsService.getDealsPage();
  const queue = canManageDeals(user.role) ? await dealsService.getFulfillments() : null;

  return <>{queue ? <FulfillmentQueuePanel queue={queue} /> : null}<DealsView data={data} /></>;
}
