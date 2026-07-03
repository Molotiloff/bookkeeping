import type { Client } from '@/types/domain';
import { formatRubCompact } from '@/lib/format';
import { GroupBadge } from './GroupBadge';
import styles from './ClientList.module.css';

interface ClientListProps {
  clients: Client[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ClientList({ clients, selectedId, onSelect }: ClientListProps) {
  return (
    <div className={styles.list} role="listbox" aria-label="Список клиентов">
      {clients.map((client) => {
        const isSelected = client.id === selectedId;
        return (
          <button
            key={client.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
            onClick={() => onSelect(client.id)}
          >
            <span className={styles.avatar} aria-hidden="true">
              {client.name.slice(0, 1)}
            </span>
            <span className={styles.info}>
              <span className={styles.name}>{client.name}</span>
              <span className={styles.meta}>
                {client.dealsCount} сделок · прибыль {formatRubCompact(client.profitRub)}
              </span>
            </span>
            <GroupBadge group={client.group} />
          </button>
        );
      })}
    </div>
  );
}
