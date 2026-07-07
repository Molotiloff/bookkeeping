'use client';

import type { MouseEvent } from 'react';
import type { BalanceClient } from '@/types/balances';
import { formatCrypto, formatMoneyRub } from '@/lib/format';
import { avatarGradient } from '@/lib/avatar';
import { Icon } from '@/components/ui/Icon';
import { CurrencyBadge } from './CurrencyBadge';
import styles from './BalancesTable.module.css';

interface BalanceTableRowProps {
  client: BalanceClient;
  onRowClick: (clientId: string) => void;
}

export function BalanceTableRow({ client, onRowClick }: BalanceTableRowProps) {
  const handleChatClick = (event: MouseEvent) => {
    event.stopPropagation();
    // TODO: открыть Telegram-чат клиента (client.chatUrl / client.telegramChatId)
    console.log('open chat', client.id, client.telegramChatId);
  };

  return (
    <tr className={styles.row} onClick={() => onRowClick(client.id)}>
      <td className={styles.clientCol}>
        <div className={styles.client}>
          <span
            className={styles.avatar}
            style={{ background: client.avatarColor ?? avatarGradient(client.id) }}
            aria-hidden="true"
          >
            {client.initials}
          </span>
          <div className={styles.clientInfo}>
            <span className={styles.clientName}>{client.name}</span>
            <span className={styles.clientNumber}>{client.clientNumber}</span>
          </div>
        </div>
      </td>

      <td className={styles.currencyCol}>
        <div className={styles.currency}>
          <CurrencyBadge currency={client.currency} size={24} />
          <span>{client.currency}</span>
        </div>
      </td>

      <td className={styles.amountCol}>{formatCrypto(client.balance, client.currency)}</td>
      <td className={styles.amountCol}>{formatMoneyRub(client.balanceRub)}</td>

      <td className={styles.chatCol}>
        <button
          type="button"
          className={styles.chatButton}
          title="Открыть чат"
          aria-label={`Открыть чат с клиентом ${client.name}`}
          onClick={handleChatClick}
        >
          <Icon name="chat" size={16} />
        </button>
      </td>
    </tr>
  );
}
