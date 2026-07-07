import { NewDealView } from '@/components/deals/new/NewDealView';
import { dealsService } from '@/services';

export default async function NewDealPage() {
  const context = await dealsService.getNewDealContext();

  return <NewDealView context={context} />;
}
