'use client';

import { useActionState } from 'react';
import { deliveryStatusAction } from '@/app/deals/[id]/actions';
import type { DealDetails } from '@/types/deals';
import { Feedback } from './DealManagementPanel';
import styles from './DealSourceActions.module.css';

export function DeliveryPanel({ details, canManage }: { details: DealDetails; canManage: boolean }) {
  const body = details.body ?? {};
  const amount = String(body.amount ?? '0');
  const reward = String(body.courier_reward ?? '0');
  const [state, action, pending] = useActionState(deliveryStatusAction.bind(null, details.deal.id, amount, reward, Number(body.courier_client_id)), {});
  const editable = canManage && ['new', 'in_delivery'].includes(details.deal.status);
  return <section className={styles.panel}>
    <h2 className={styles.heading}>Доставка</h2>
    <dl className={`${styles.form} ${styles.invoiceFacts}`}>
      <div className={styles.field}><dt className={styles.meta}>Курьер</dt><dd>{String(body.courier_name ?? 'Не указан')}</dd></div>
      <div className={styles.field}><dt className={styles.meta}>Вознаграждение</dt><dd>{reward} RUB</dd></div>
      <div className={styles.field}><dt className={styles.meta}>Баланс курьера</dt><dd>{String(body.courier_client_name ?? `Клиент #${body.courier_client_id}`)}</dd></div>
      <div className={styles.field}><dt className={styles.meta}>Адрес</dt><dd>{String(body.address || 'Не указан')}</dd></div>
    </dl>
    <p className={styles.meta}>{body.delivery_posted
      ? `С клиента и городской кассы списано ${amount} RUB. Курьеру начислено ${reward} RUB; вознаграждение учтено как расход «Доставка».`
      : `После завершения ${amount} RUB спишется с клиента и городской кассы. ${reward} RUB начислится на баланс курьера и будет учтено как расход «Доставка». Повторное нажатие не создаёт повторных проводок.`}</p>
    {body.delivery_posted ? <p className={styles.success}>Доставка проведена, вознаграждение начислено.</p> : null}
    <Feedback state={state} />
    {editable ? <form action={action} className={styles.formFooter} onSubmit={(event) => {
      const status = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value;
      const text = status === 'done' ? `Завершить доставку: списать ${amount} RUB с клиента и кассы, начислить ${reward} RUB курьеру?` : status === 'canceled' ? 'Отменить доставку без движения денег?' : 'Передать доставку курьеру?';
      if (!window.confirm(text)) event.preventDefault();
    }}>
      {details.deal.status === 'new' ? <button className={styles.primaryButton} name="status" value="in_delivery" disabled={pending}>Передать курьеру</button> : null}
      <button className={styles.primaryButton} name="status" value="done" disabled={pending}>{pending ? 'Сохраняем…' : 'Завершить доставку'}</button>
      <button className={styles.dangerButton} name="status" value="canceled" disabled={pending}>Отменить доставку</button>
    </form> : null}
  </section>;
}
