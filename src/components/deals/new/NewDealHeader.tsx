'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import styles from './NewDealHeader.module.css';

export function NewDealHeader({ onSubmit }: { onSubmit: () => void }) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <button
          type="button"
          className={styles.backButton}
          aria-label="Назад к сделкам"
          onClick={() => router.push('/deals')}
        >
          <Icon name="arrow-left" size={17} />
        </button>
        <div>
          <h1 className={styles.title}>Новая сделка</h1>
          <p className={styles.subtitle}>Создание новой сделки</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.cancelButton} onClick={() => router.push('/deals')}>
          Отмена
        </button>
        <button type="button" className={styles.submitButton} onClick={onSubmit}>
          Добавить сделку
        </button>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
