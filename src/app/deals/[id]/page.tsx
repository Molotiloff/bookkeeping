import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { dealsService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';
import { formatMoney, formatRub } from '@/lib/format';
import { dealDirection, dealOperation } from '@/types/deals';
import styles from './page.module.css';

export default async function DealDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRouteAccess('/deals');
  const { id } = await params;
  const details = await dealsService.getDealById(id);

  if (!details) {
    notFound();
  }

  const { deal } = details;

  return (
    <div className={styles.page}>
      <Link href="/deals" className={styles.backLink}>
        ← Все сделки
      </Link>

      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Сделка {details.dealNo}</h1>
          <p className={styles.subtitle}>
            {dealOperation(deal)} · {deal.clientName} · {deal.city}
          </p>
        </div>
        <StatusBadge status={deal.status} />
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Параметры сделки</h2>
          <div className={styles.facts}>
            <div className={styles.fact}>
              <span className={styles.label}>Сумма</span>
              <span className={styles.amount}>{formatRub(deal.amountRub)}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>Направление</span>
              <span className={styles.value}>{dealDirection(deal)}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>Контрагент</span>
              <span className={styles.value}>{details.counterpartyName ?? 'Не указан'}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>КТ-процент</span>
              <span className={styles.value}>
                {details.counterpartyPercent !== undefined ? `${details.counterpartyPercent}%` : 'Не указан'}
              </span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>Прибыль</span>
              <span className={styles.value}>{formatRub(details.profitRub)}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>Источник</span>
              <span className={styles.value}>{details.source}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>Создал</span>
              <span className={styles.value}>{deal.createdBy}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>Обновлено</span>
              <span className={styles.value}>{details.updatedAt}</span>
            </div>
          </div>
          {details.comment ? <p className={styles.comment}>{details.comment}</p> : null}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Статусы</h2>
          <div className={styles.events}>
            {details.statusEvents.map((event) => (
              <div key={event.id} className={styles.event}>
                <span className={styles.eventTitle}>
                  {event.oldStatus ? `${event.oldStatus} → ${event.newStatus}` : event.newStatus}
                </span>
                <span className={styles.eventMeta}>
                  {event.createdAt} · {event.actorName}
                </span>
                {event.comment ? <span className={styles.eventMeta}>{event.comment}</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Денежные ноги</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Направление</th>
              <th>Валюта</th>
              <th>Сумма</th>
              <th>Курс</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {details.legs.map((leg) => (
              <tr key={leg.id}>
                <td>{leg.direction}</td>
                <td>{leg.currency}</td>
                <td>{formatMoney({ currency: leg.currency, amount: leg.amount })}</td>
                <td>{leg.rate ?? '—'}</td>
                <td>{leg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
