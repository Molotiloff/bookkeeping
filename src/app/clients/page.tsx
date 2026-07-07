import { ClientsView } from '@/components/clients/ClientsView';
import { clientsService } from '@/services';

export default async function ClientsPage() {
  const data = await clientsService.getClientsPage();

  return <ClientsView data={data} />;
}
