'use client';

import { Icon } from '@/components/ui/Icon';
import type { NewDealType } from '@/types/newDeal';
import { NEW_DEAL_TYPES } from './newDealConfig';
import styles from './DealTypeTabs.module.css';

const TONES = [styles.tone1, styles.tone2, styles.tone3, styles.tone4];

interface DealTypeTabsProps {
  active: NewDealType;
  onChange: (type: NewDealType) => void;
}

export function DealTypeTabs({ active, onChange }: DealTypeTabsProps) {
  return (
    <div className={styles.scroll} role="tablist" aria-label="Тип сделки">
      <div className={styles.tabs}>
        {NEW_DEAL_TYPES.map((item, index) => {
          const isActive = item.type === active;
          return (
            <button
              key={item.type}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => onChange(item.type)}
            >
              <span className={`${styles.iconWrap} ${isActive ? '' : TONES[index % TONES.length]}`}>
                <Icon name={item.icon} size={15} />
              </span>
              <span className={styles.tabLabel}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
