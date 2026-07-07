'use client';

import { Icon } from '@/components/ui/Icon';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { SearchInput } from '@/components/ui/SearchInput';
import styles from './ClientsHeader.module.css';

interface ClientsHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function ClientsHeader({ query, onQueryChange }: ClientsHeaderProps) {
  const handleCreateClient = () => {
    // TODO: форма создания клиента (имя, Telegram, chat_id, менеджер, контрагент, процент КТ, комментарий)
    console.log('create client');
  };

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Клиенты</h1>
        <p className={styles.subtitle}>Управление клиентской базой</p>
      </div>

      <div className={styles.controls}>
        <SearchInput value={query} onChange={onQueryChange} placeholder="Поиск по клиентам" />

        {/* TODO: фильтры по менеджеру, количеству сделок и обороту */}
        <button type="button" className={styles.filters}>
          <Icon name="filter" size={14} />
          <span>Фильтры</span>
        </button>

        <button type="button" className={styles.createButton} onClick={handleCreateClient}>
          <Icon name="plus" size={15} />
          <span>Новый клиент</span>
        </button>

        <ThemeSwitcher />
      </div>
    </header>
  );
}
