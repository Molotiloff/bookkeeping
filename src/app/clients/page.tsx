import { Header } from '@/components/layout/Header';
import { ClientsView } from '@/components/clients/ClientsView';
import { clientsService } from '@/services';

export default async function ClientsPage() {
  const clients = await clientsService.getClients();

  return (
    <>
      <Header
        title="Клиенты"
        subtitle="База клиентов и Telegram-связки"
        period="01.05.2024 – 31.05.2024"
        hasUnread
      />
      <ClientsView clients={clients} />
    </>
  );
}
