'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { SearchInput } from '@/components/ui/SearchInput';
import { CitySelect } from './CitySelect';
import styles from './DealsHeader.module.css';

interface DealsHeaderProps {
  cities: string[];
  city: string;
  onCityChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

export function DealsHeader({ cities, city, onCityChange, query, onQueryChange }: DealsHeaderProps) {
  const router = useRouter();
  const handleCreateDeal = () => router.push('/deals/new');

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Сделки</h1>
        <p className={styles.subtitle}>Управление текущими сделками</p>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.createButton} onClick={handleCreateDeal}>
          <Icon name="plus" size={15} />
          <span>Новая сделка</span>
        </button>

        <CitySelect cities={cities} value={city} onChange={onCityChange} />
        <SearchInput value={query} onChange={onQueryChange} placeholder="Поиск по сделкам" />

        {/* TODO: панель дополнительных фильтров */}
        <button type="button" className={styles.iconButton} aria-label="Дополнительные фильтры">
          <Icon name="sliders" size={16} />
        </button>

        <ThemeSwitcher />
      </div>
    </header>
  );
}
