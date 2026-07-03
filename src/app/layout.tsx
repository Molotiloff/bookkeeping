import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider, themeInitScript } from '@/theme/ThemeProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { NAV_ITEMS } from '@/components/layout/navigation';
import { userService } from '@/services';
import styles from './layout.module.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkyEx CRM',
  description: 'CRM для обработки обменных заявок из Telegram-бота',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await userService.getCurrentUser();

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <div className={styles.shell}>
            <Sidebar items={NAV_ITEMS} user={user} />
            <main className={styles.main}>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
