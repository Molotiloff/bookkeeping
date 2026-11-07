'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { reorderQueueAction } from '@/app/deals/[id]/actions';
import type { FulfillmentItem, FulfillmentQueue } from '@/types/dealManagement';
import { Feedback } from './DealManagementPanel';
import { Icon } from '@/components/ui/Icon';
import styles from './FulfillmentQueuePanel.module.css';

export function FulfillmentQueuePanel({ queue }: { queue: FulfillmentQueue }) {
  const queued = queue.items.filter((item) => item.status === 'queued');
  const countLabel = new Intl.PluralRules('ru').select(queue.items.length);
  return <details className={styles.panel}>
    <summary className={styles.summary}>
      <span className={styles.heading}>
        <span className={styles.icon}><Icon name="repeat" size={19} /></span>
        <span className={styles.title}>Очередь USDT</span>
        <span className={styles.count}>{queue.items.length} {countLabel === 'one' ? 'заявка' : countLabel === 'few' ? 'заявки' : 'заявок'}</span>
      </span>
      <span className={styles.summaryEnd}>
        <span className={styles.total}>{quantity(queue.queuedQty)} <span>USDT</span></span>
        <Icon name="chevron-down" size={18} className={styles.chevron} />
      </span>
    </summary>
    <div className={styles.content}>
      <dl className={styles.metrics}>
        <Metric label="Фактический остаток" value={queue.usdtFact} />
        <Metric label="On-chain остаток" value={queue.onchainLiquidQty} />
        <Metric label="Нехватка" value={queue.queueShortageQty} shortage />
      </dl>
      <p className={styles.note}><Icon name="info" size={16} />Изменение порядка не проводит деньги. Исполняющиеся переводы переставлять нельзя.</p>
      {queue.items.length === 0 ? <div className={styles.empty}><Icon name="check-circle" size={22} /><p>Активных заявок нет</p><span>Новые заявки появятся здесь автоматически.</span></div> : null}
      <ol className={styles.list} aria-label="Порядок заявок USDT">
        {queue.items.map((item, index) => <li key={item.id} className={styles.item}>
          <span className={styles.position} aria-label={`Позиция ${index + 1}`}>{index + 1}</span>
          <div className={styles.identity}>
            <Link href={`/deals/${item.dealId}`} className={styles.dealLink}>Сделка #{item.dealId}</Link>
            <span className={styles.kind}>{item.requestKind === 'sale' ? 'Продажа' : 'Вывод клиента'}</span>
          </div>
          <span className={styles.amount}>{quantity(item.qty)} <span>USDT</span></span>
          <span className={`${styles.status} ${item.status === 'executing' ? styles.executing : ''}`}>{item.status === 'executing' ? 'Исполняется' : 'Ожидает'}</span>
          {item.status === 'queued' ? <QueueMove item={item} queued={queued} /> : <span className={styles.locked}>Уже в работе</span>}
        </li>)}
      </ol>
    </div>
  </details>;
}

function Metric({ label, value, shortage = false }: { label: string; value: string | null; shortage?: boolean }) {
  const hasShortage = shortage && value !== null && Number(value) > 0;
  return <div className={styles.metric}>
    <dt>{label}</dt>
    <dd className={hasShortage ? styles.shortage : undefined}>{value === null ? 'Нет данных' : <>{quantity(value)} <span>USDT</span></>}</dd>
  </div>;
}

function quantity(value: string): string {
  const [whole, fraction] = value.split('.');
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')}${fraction ? `,${fraction}` : ''}`;
}

function QueueMove({ item, queued }: { item: FulfillmentItem; queued: FulfillmentItem[] }) {
  const index = queued.findIndex((other) => other.id === item.id);
  const [state, action, pending] = useActionState(
    reorderQueueAction.bind(null, item.id, index > 0 ? queued[index - 1].id : null), {},
  );
  return <form action={action} className={styles.action}>
    <button className={styles.moveButton} disabled={pending || index === 0}
      aria-label={`Поднять сделку #${item.dealId} выше в очереди`}
      title={index === 0 ? 'Заявка уже первая в очереди' : undefined}>
      <Icon name="chevron-down" size={16} className={styles.upIcon} />
      {pending ? 'Перемещаем…' : 'Выше в очереди'}
    </button>
    <Feedback state={state} />
  </form>;
}
