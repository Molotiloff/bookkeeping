import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { themeInitScript } from '@/theme/config';
import { Sidebar } from '@/components/layout/Sidebar';
import { navItemsForRole } from '@/components/layout/navigation';
import { userService } from '@/services';
import styles from './layout.module.css';
import './globals.css';
import { ApiError } from '@/api/httpClient';
import { getApiRuntimeConfig } from '@/api/config';
import { DealsRealtimeRefresh } from '@/components/deals/DealsRealtimeRefresh';

export const metadata: Metadata = {
  title: 'SkyEx CRM',
  description: 'CRM для обработки обменных заявок из Telegram-бота',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get('x-crm-pathname') ?? '';
  const isPublicPage = pathname === '/login';

  let content = children;
  if (!isPublicPage) {
    let user;
    try {
      user = await userService.getCurrentUser();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) redirect('/login');
      throw error;
    }

    const apiConfig = getApiRuntimeConfig();
    content = (
      <>
        {!apiConfig.useMocks && <DealsRealtimeRefresh wsUrl={apiConfig.wsUrl} />}
        <div className={styles.shell}>
          <Sidebar items={navItemsForRole(user.role)} user={user} />
          <main className={styles.main}>{children}</main>
        </div>
      </>
    );
  }

  return (
    <html lang="ru" data-theme="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body>
        <ThemeProvider>{content}</ThemeProvider>
      </body>
    </html>
  );
}
