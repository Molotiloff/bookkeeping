'use client';

import { useMemo, useState } from 'react';
import type { Client } from '@/types/domain';
import { ChartCard } from '@/components/ui/ChartCard';
import { ClientList } from './ClientList';
import { ClientDetail } from './ClientDetail';
import styles from './ClientsView.module.css';

/** Master-detail: список клиентов слева, карточка выбранного справа */
export function ClientsView({ clients }: { clients: Client[] }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? '');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((client) => client.name.toLowerCase().includes(q));
  }, [clients, query]);

  const selected =
    clients.find((client) => client.id === selectedId) ?? filtered[0] ?? clients[0];

  return (
    <div className={styles.grid}>
      <ChartCard title="Клиенты" subtitle={`Всего: ${clients.length}`}>
        <input
          type="search"
          className={styles.search}
          placeholder="Поиск по имени…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Поиск клиента"
        />
        <ClientList clients={filtered} selectedId={selected?.id ?? ''} onSelect={setSelectedId} />
      </ChartCard>

      <ChartCard title="Карточка клиента">
        {selected ? (
          <ClientDetail client={selected} />
        ) : (
          <p className={styles.empty}>Клиент не найден</p>
        )}
      </ChartCard>
    </div>
  );
}
