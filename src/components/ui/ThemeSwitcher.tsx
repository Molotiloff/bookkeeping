'use client';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import styles from './ThemeSwitcher.module.css';

/**
 * Иконка выбирается через CSS по data-theme на <html>,
 * поэтому серверный и клиентский рендер всегда совпадают.
 */
export function ThemeSwitcher() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.switcher}
      onClick={toggleTheme}
      aria-label="Переключить тему"
      title="Переключить тему"
    >
      <span className={styles.iconLight}>
        <Icon name="moon" size={16} />
      </span>
      <span className={styles.iconDark}>
        <Icon name="sun" size={16} />
      </span>
    </button>
  );
}
