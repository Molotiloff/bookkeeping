'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { CitySelect } from '@/components/deals/CitySelect';
import styles from './MainHeader.module.css';

interface MainHeaderProps {
  dateLabel: string;
  weekdayLabel: string;
  cities: string[];
}

export function MainHeader({ dateLabel, weekdayLabel, cities }: MainHeaderProps) {
  const [city, setCity] = useState('ALL');

  const handleCityChange = (value: string) => {
    setCity(value);
    // TODO: подключить фильтрацию API по городу
    console.log(value);
  };

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Главная</h1>
        <p className={styles.subtitle}>Финансовые показатели</p>
      </div>

      <div className={styles.controls}>
        <span className={styles.date}>
          <Icon name="calendar" size={15} />
          <span className={styles.dateText}>
            <span className={styles.dateValue}>{dateLabel}</span>
            <span className={styles.weekday}>{weekdayLabel}</span>
          </span>
        </span>

        <CitySelect cities={cities} value={city} onChange={handleCityChange} />

        {/* TODO: открыть панель фильтров */}
        <button type="button" className={styles.filters} onClick={() => console.log('open filters')}>
          <Icon name="filter" size={14} />
          <span>Фильтры</span>
        </button>

        <ThemeSwitcher />
      </div>
    </header>
  );
}
