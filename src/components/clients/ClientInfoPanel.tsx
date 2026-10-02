'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveTelegramInviteLink } from '@/app/clients/actions';
import type { Client } from '@/types/clients';
import { formatCrypto, formatMoneyRub, formatRub } from '@/lib/format';
import { telegramChatLink } from '@/lib/telegramChatLink';
import { avatarGradient } from '@/lib/avatar';
import { Icon } from '@/components/ui/Icon';
import { ClientComments } from './ClientComments';
import styles from './ClientInfoPanel.module.css';

function ClientContactBlock({ client, canEdit }: { client: Client; canEdit: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(client.telegramInviteLink ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const chatHref = telegramChatLink({
    chatId: client.telegramChatId,
    username: client.telegramUsername,
    inviteLink: client.telegramInviteLink,
  });

  const handleCopyChatId = () => {
    void navigator.clipboard.writeText(client.telegramChatId);
  };

  const handleSaveInvite = async () => {
    setSaving(true);
    setError('');
    const result = await saveTelegramInviteLink(client.id, draft.trim() || null);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setEditing(false);
    router.refresh();
  };

  return (
    <div className={styles.contactBlock}>
      <div className={styles.contactRow}>
        <span className={styles.contactIcon}>
          <Icon name="telegram" size={13} />
        </span>
        <span className={styles.contactValue}>{client.telegramUsername || 'Telegram-чат'}</span>
        {chatHref ? <a
          className={styles.contactAction}
          title="Открыть чат"
          aria-label="Открыть Telegram-чат"
          href={chatHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="external" size={13} />
        </a> : null}
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
      {canEdit ? (
        editing ? (
          <div className={styles.inviteEditor}>
            <label htmlFor={`invite-${client.id}`}>Ссылка Telegram для открытия в приложении</label>
            <input
              id={`invite-${client.id}`}
              type="url"
              value={draft}
              placeholder="https://t.me/+..."
              onChange={(event) => setDraft(event.target.value)}
              disabled={saving}
            />
            {error ? <span className={styles.inviteError} role="alert">{error}</span> : null}
            <div className={styles.inviteActions}>
              <button type="button" disabled={saving} onClick={() => void handleSaveInvite()}>
                Сохранить
              </button>
              <button type="button" disabled={saving} onClick={() => {
                setDraft(client.telegramInviteLink ?? '');
                setError('');
                setEditing(false);
              }}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className={styles.inviteEditButton} onClick={() => {
            setDraft(client.telegramInviteLink ?? '');
            setError('');
            setEditing(true);
          }}>
            {client.telegramInviteLink ? 'Изменить ссылку Telegram' : 'Добавить ссылку Telegram'}
          </button>
        )
      ) : null}
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
    { label: 'Операций всего', value: String(client.dealsCount) },
    { label: 'Оборот', value: formatRub(client.turnoverRub) },
    { label: 'Объём покупки', value: formatRub(client.purchaseVolumeRub) },
    { label: 'Объём продажи', value: formatRub(client.saleVolumeRub) },
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
      <h3 className={styles.sectionTitle}>Последние операции</h3>
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
  canEditTelegramLink: boolean;
}

export function ClientInfoPanel({ client, onClose, canEditTelegramLink }: ClientInfoPanelProps) {
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

      <ClientContactBlock client={client} canEdit={canEditTelegramLink} />
      <ClientMainInfo client={client} />
      <ClientBalances client={client} />
      <ClientStats client={client} />
      <ClientRecentDeals client={client} />
      <ClientComments comments={client.comments} />
    </aside>
  );
}
