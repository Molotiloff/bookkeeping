import Link from 'next/link';
import { notFound } from 'next/navigation';
import { clientsService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';
import { formatCrypto, formatRub } from '@/lib/format';
import styles from './page.module.css';

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRouteAccess('/clients');
  const { id } = await params;
  const client = await clientsService.getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <Link href="/clients" className={styles.backLink}>
        ← Все клиенты
      </Link>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{client.name}</h1>
          <p className={styles.subtitle}>
            {client.clientNumber} · {client.telegramUsername} · {client.telegramChatId}
          </p>
        </div>
      </header>

      <section className={styles.grid}>
        <div className={styles.stack}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Профиль</h2>
            <div className={styles.facts}>
              <div className={styles.fact}>
                <span className={styles.label}>Менеджер</span>
                <span className={styles.value}>{client.managerName}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>Регистрация</span>
                <span className={styles.value}>{client.registrationDate}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>Контрагент</span>
                <span className={styles.value}>{client.counterpartyName ?? 'Не указан'}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>КТ-процент</span>
                <span className={styles.value}>
                  {client.counterpartyPercent !== undefined ? `${client.counterpartyPercent}%` : 'Не указан'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Статистика</h2>
            <div className={styles.facts}>
              <div className={styles.fact}>
                <span className={styles.label}>Сделок</span>
                <span className={styles.value}>{client.dealsCount}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>Оборот</span>
                <span className={styles.value}>{formatRub(client.turnoverRub)}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>Прибыль</span>
                <span className={styles.value}>{formatRub(client.totalProfitRub)}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>Средний чек</span>
                <span className={styles.value}>{formatRub(client.averageCheckRub)}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>Покупки</span>
                <span className={styles.value}>{formatRub(client.purchaseVolumeRub)}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>Продажи</span>
                <span className={styles.value}>{formatRub(client.saleVolumeRub)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.stack}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Балансы</h2>
            <div className={styles.balances}>
              {client.balances.map((balance) => (
                <div key={balance.currency} className={styles.balanceRow}>
                  <span className={styles.value}>{balance.currency}</span>
                  <span className={balance.amount < 0 ? styles.negative : styles.positive}>
                    {formatCrypto(balance.amount, balance.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Комментарии</h2>
            {client.comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div>
                  <div className={styles.value}>{comment.text}</div>
                  <div className={styles.muted}>
                    {comment.date} · {comment.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Последние сделки</h2>
        {client.recentDeals.map((deal) => (
          <div key={deal.id} className={styles.dealRow}>
            <div>
              <div className={styles.value}>
                {deal.id} · {deal.type} · {deal.direction}
              </div>
              <div className={styles.muted}>{deal.time}</div>
            </div>
            <span className={styles.value}>{formatRub(deal.amountRub)}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
