'use client';

import { Icon } from '@/components/ui/Icon';
import type { CurrencyFilterValue } from '@/types/balances';
import styles from './CurrencyFilter.module.css';

const OPTIONS: { value: CurrencyFilterValue; label: string }[] = [
  { value: 'ALL', label: 'Все валюты' },
  { value: 'USDT', label: 'USDT' },
  { value: 'RUB', label: 'RUB' },
  { value: 'BTC', label: 'BTC' },
  { value: 'ETH', label: 'ETH' },
];

interface CurrencyFilterProps {
  value: CurrencyFilterValue;
  onChange: (value: CurrencyFilterValue) => void;
}

export function CurrencyFilter({ value, onChange }: CurrencyFilterProps) {
  return (
    <label className={styles.wrap}>
      <select
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value as CurrencyFilterValue)}
        aria-label="Фильтр по валюте"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={14} className={styles.chevron} />
    </label>
  );
}
