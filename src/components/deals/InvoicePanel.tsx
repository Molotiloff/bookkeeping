'use client';

import { useActionState } from 'react';
import { postInvoiceAction, cancelInvoiceAction } from '@/app/deals/[id]/actions';
import type { DealDetails } from '@/types/deals';
import { invoiceProfit, invoiceUsdt } from '@/lib/invoice';
import { Feedback } from './DealManagementPanel';
import styles from './DealSourceActions.module.css';

export function InvoicePanel({ details, canManage }: { details: DealDetails; canManage: boolean }) {
  const received = String(details.body?.received_usdt ?? '0');
  const paid = String(details.body?.paid_usdt ?? '0');
  const profit = invoiceProfit(received, paid);
  const loss = profit.startsWith('-');
  const [postState, postAction, posting] = useActionState(postInvoiceAction.bind(null, details.deal.id, received, paid), {});
  const [cancelState, cancelAction, canceling] = useActionState(cancelInvoiceAction.bind(null, details.deal.id), {});
  const editable = canManage && details.deal.status === 'new';
  return <section className={styles.panel}>
    <h2 className={styles.heading}>Расчёт инвойса</h2>
    <dl className={`${styles.form} ${styles.invoiceFacts}`}>
      <div className={styles.field}><dt className={styles.meta}>USDT получили от партнёра</dt><dd>{invoiceUsdt(received)}</dd></div>
      <div className={styles.field}><dt className={styles.meta}>USDT отдали клиенту</dt><dd>{invoiceUsdt(paid)}</dd></div>
      <div className={styles.field}><dt className={styles.meta}>{loss ? 'Убыток' : 'Прибыль'}</dt><dd className={loss ? styles.error : styles.success}>{invoiceUsdt(profit)}</dd></div>
    </dl>
    <p className={styles.meta}>Получили минус отдали. Клиентский кошелёк не меняется. При проведении разница учитывается в прибыли и в остатке /акт чата заявок.</p>
    {details.body?.invoice_posted ? <p className={styles.meta}>{details.body.cash_basis === 'act' ? 'ACT (/акт)' : 'Касса USDT'}: {invoiceUsdt(String(details.body.cash_before_usdt))} → {invoiceUsdt(String(details.body.cash_after_usdt))}</p> : null}
    <Feedback state={postState} /><Feedback state={cancelState} />
    {editable ? <>
      <form action={postAction} className={styles.formFooter} onSubmit={(event) => {
        if (!window.confirm(loss ? `Провести инвойс с убытком ${invoiceUsdt(profit)}? Эта сумма уменьшит кассу.` : 'Провести инвойс и учесть движение кассы и прибыль?')) event.preventDefault();
      }}>
        {loss ? <label className={styles.meta}><input type="checkbox" name="allowLoss" required disabled={posting || canceling} /> Подтверждаю проведение с убытком {invoiceUsdt(profit)}</label> : <span />}
        <button className={loss ? styles.dangerButton : styles.primaryButton} disabled={posting || canceling}>{posting ? 'Проводим…' : 'Провести'}</button>
      </form>
      <form action={cancelAction} className={styles.cancelRow} onSubmit={(event) => { if (!window.confirm('Отменить новый инвойс без движения денег?')) event.preventDefault(); }}>
        <label className={styles.cancelComment}><span>Причина отмены</span><input name="comment" disabled={posting || canceling} /></label>
        <button className={styles.dangerButton} disabled={posting || canceling}>Отменить инвойс</button>
      </form>
    </> : null}
  </section>;
}
