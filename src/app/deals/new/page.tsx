import { NewDealView } from '@/components/deals/new/NewDealView';
import { dealsService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';

export default async function NewDealPage() {
  await requireRouteAccess('/deals');
  const context = await dealsService.getNewDealContext();

  return <NewDealView context={context} />;
}
