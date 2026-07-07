'use client';

import { useMemo, useState } from 'react';
import type { ClientsPageData } from '@/types/clients';
import { ClientsHeader } from './ClientsHeader';
import { ClientsMetricGrid } from './ClientsMetricGrid';
import { ClientsTable } from './ClientsTable';
import { ClientInfoPanel } from './ClientInfoPanel';
import styles from './ClientsView.module.css';

/** Список + карточка: выбор клиента в таблице показывает его в правой панели */
export function ClientsView({ data }: { data: ClientsPageData }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(data.clients[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.clients;
    return data.clients.filter(
      (client) =>
        client.name.toLowerCase().includes(q) ||
        client.telegramUsername.toLowerCase().includes(q) ||
        client.telegramChatId.includes(q) ||
        client.clientNumber.toLowerCase().includes(q),
    );
  }, [data.clients, query]);

  const selected = data.clients.find((client) => client.id === selectedId) ?? null;

  const handleSelect = (clientId: string) => setSelectedId(clientId);

  return (
    <>
      <ClientsHeader query={query} onQueryChange={setQuery} />
      <ClientsMetricGrid metrics={data.metrics} />

      <div className={`${styles.grid} ${selected ? '' : styles.gridNoPanel}`}>
        <ClientsTable
          clients={filtered}
          totalClients={data.totalClients}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
        {selected ? (
          <ClientInfoPanel client={selected} onClose={() => setSelectedId(null)} />
        ) : null}
      </div>
    </>
  );
}
