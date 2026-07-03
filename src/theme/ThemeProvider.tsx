'use client';

import { createContext, useCallback, useContext, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'skyex-theme';

interface ThemeContextValue {
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Инлайн-скрипт для layout: выставляет тему до первого рендера, без FOUC */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

/**
 * Тема живёт в data-theme на <html> — единственный источник истины.
 * Компоненты реагируют на неё через CSS (токены и селекторы),
 * поэтому провайдеру не нужно состояние и нет hydration-mismatch.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* приватный режим — тема просто не сохранится */
    }
  }, []);

  return <ThemeContext.Provider value={{ toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme должен вызываться внутри ThemeProvider');
  return ctx;
}
