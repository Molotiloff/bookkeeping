import { headers } from 'next/headers';
import { TelegramLoginWidget } from '@/components/auth/TelegramLoginWidget';
import styles from './page.module.css';

export default async function LoginPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get('host') ?? 'localhost:3000';
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http';
  const origin = process.env.CRM_FRONTEND_ORIGIN ?? `${protocol}://${host}`;
  const botUsername = (process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? '').replace(/^@/, '');

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">S</span>
          <span>SkyEx CRM</span>
        </div>
        <h1 id="login-title">Вход для сотрудников</h1>
        <p>Используйте Telegram-аккаунт, добавленный администратором CRM.</p>
        <div className={styles.widget}>
          {botUsername ? (
            <TelegramLoginWidget
              botUsername={botUsername}
              authUrl={`${origin}/api/auth/telegram/callback`}
            />
          ) : (
            <span className={styles.unavailable}>Вход временно недоступен</span>
          )}
        </div>
      </section>
    </main>
  );
}
