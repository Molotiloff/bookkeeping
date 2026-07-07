import { DealsView } from '@/components/deals/DealsView';
import { dealsService } from '@/services';

export default async function DealsPage() {
  const data = await dealsService.getDealsPage();

  return <DealsView data={data} />;
}
