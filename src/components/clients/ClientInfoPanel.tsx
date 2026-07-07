'use client';

import Link from 'next/link';
import type { Client } from '@/types/clients';
import { formatCrypto, formatMoneyRub, formatRub } from '@/lib/format';
import { avatarGradient } from '@/lib/avatar';
import { Icon } from '@/components/ui/Icon';
import { ClientComments } from './ClientComments';
import styles from './ClientInfoPanel.module.css';

function ClientContactBlock({ client }: { client: Client }) {
  const handleOpenTelegram = () => {
    // TODO: открыть Telegram-чат клиента
    console.log('open telegram', client.telegramChatId);
  };

  const handleCopyChatId = () => {
    navigator.clipboard.writeText(client.telegramChatId);
  };

  return (
    <div className={styles.contactBlock}>
      <div className={styles.contactRow}>
        <span className={styles.contactIcon}>
          <Icon name="telegram" size={13} />
        </span>
        <span className={styles.contactValue}>{client.telegramUsername}</span>
        <button
          type="button"
          className={styles.contactAction}
          title="Открыть чат"
          aria-label="Открыть Telegram-чат"
          onClick={handleOpenTelegram}
        >
          <Icon name="external" size={13} />
        </button>
      </div>
      <div className={styles.contactRow}>
        <span className={styles.contactIcon}>
          <Icon name="chat" size={13} />
        </span>
        <span className={`${styles.contactValue} ${styles.chatId}`}>{client.telegramChatId}</span>
        <button
          type="button"
          className={styles.contactAction}
          title="Скопировать chat_id"
          aria-label="Скопировать chat_id"
          onClick={handleCopyChatId}
        >
          <Icon name="copy" size={13} />
        </button>
      </div>
    </div>
  );
}

function ClientMainInfo({ client }: { client: Client }) {
  const rows = [
    { label: 'Дата регистрации', value: client.registrationDate },
    { label: 'Менеджер', value: client.managerName },
    { label: 'Контрагент', value: client.counterpartyName ?? '—' },
    {
      label: 'Процент КТ',
      value:
        client.counterpartyPercent !== undefined
          ? `${client.counterpartyPercent.toFixed(2)} %`
          : '—',
    },
  ];

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Основная информация</h3>
      <dl className={styles.infoRows}>
        {rows.map((row) => (
          <div key={row.label} className={styles.infoRow}>
            <dt className={styles.infoLabel}>{row.label}</dt>
            <dd className={styles.infoValue}>{row.value}</dd>
          </div>
        ))}
      </dl>
      {client.comment ? <p className={styles.commentNote}>{client.comment}</p> : null}
    </section>
  );
}

function ClientBalances({ client }: { client: Client }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Балансы</h3>
      <dl className={styles.infoRows}>
        {client.balances.map((balance) => (
          <div key={balance.currency} className={styles.infoRow}>
            <dt className={styles.infoLabel}>{balance.currency}</dt>
            <dd className={styles.infoValue}>
              {balance.currency === 'RUB'
                ? formatMoneyRub(balance.amount)
                : formatCrypto(balance.amount, balance.currency)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ClientStats({ client }: { client: Client }) {
  const cells = [
    { label: 'Сделок всего', value: String(client.dealsCount) },
    { label: 'Оборот', value: formatRub(client.turnoverRub) },
    { label: 'Объём покупки', value: formatRub(client.purchaseVolumeRub) },
    { label: 'Объём продажи', value: formatRub(client.saleVolumeRub) },
    { label: 'Прибыль', value: formatRub(client.totalProfitRub) },
    { label: 'Средний чек', value: formatRub(client.averageCheckRub) },
  ];

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Статистика клиента</h3>
      <div className={styles.statsGrid}>
        {cells.map((cell) => (
          <div key={cell.label} className={styles.statCell}>
            <span className={styles.statLabel}>{cell.label}</span>
            <span className={styles.statValue}>{cell.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClientRecentDeals({ client }: { client: Client }) {
  const handleDealClick = (dealId: string) => {
    // TODO: переход в карточку сделки
    console.log('open deal', dealId);
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Последние сделки</h3>
      <ul className={styles.dealsList}>
        {client.recentDeals.map((deal) => (
          <li key={deal.id}>
            <button
              type="button"
              className={styles.dealRow}
              onClick={() => handleDealClick(deal.id)}
            >
              <span className={styles.dealId}>{deal.id}</span>
              <span className={styles.dealInfo}>
                {deal.type} {deal.direction}
              </span>
              <span className={styles.dealAmount}>{formatRub(deal.amountRub)}</span>
              <span className={styles.dealTime}>{deal.time}</span>
            </button>
          </li>
        ))}
      </ul>
      <Link href={`/deals?clientId=${client.id}`} className={styles.allDealsLink}>
        Все сделки клиента
        <Icon name="chevron-right" size={14} />
      </Link>
    </section>
  );
}

interface ClientInfoPanelProps {
  client: Client;
  onClose: () => void;
}

export function ClientInfoPanel({ client, onClose }: ClientInfoPanelProps) {
  return (
    <aside className={styles.panel} aria-label="Информация о клиенте">
      <header className={styles.header}>
        <h2 className={styles.heading}>Информация о клиенте</h2>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Закрыть панель"
          onClick={onClose}
        >
          <Icon name="x" size={15} />
        </button>
      </header>

      <div className={styles.identity}>
        <span
          className={styles.avatar}
          style={{ background: avatarGradient(client.id) }}
          aria-hidden="true"
        >
          {client.initials}
        </span>
        <div>
          <span className={styles.name}>{client.name}</span>
          <span className={styles.number}>{client.clientNumber}</span>
        </div>
      </div>

      <ClientContactBlock client={client} />
      <ClientMainInfo client={client} />
      <ClientBalances client={client} />
      <ClientStats client={client} />
      <ClientRecentDeals client={client} />
      <ClientComments comments={client.comments} />
    </aside>
  );
}
