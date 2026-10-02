import { ClientsView } from '@/components/clients/ClientsView';
import { clientsService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';

export default async function ClientsPage() {
  const user = await requireRouteAccess('/clients');
  const data = await clientsService.getClientsPage();

  return <ClientsView data={data} canEditTelegramLink={user.role !== 'cashier'} />;
}
