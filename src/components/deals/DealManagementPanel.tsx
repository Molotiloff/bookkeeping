'use client';

import { useActionState, useRef, useState } from 'react';
import { adjustTransferAction, changeStatusAction, resolveSettlementAction, type DealActionState } from '@/app/deals/[id]/actions';
import { positiveDecimal, transferAdjustable, workflowStatuses } from '@/lib/dealManagement';
import type { DealDetails } from '@/types/deals';
import type { DealSettlement, TransferAdjustmentRequest } from '@/types/dealManagement';
import { DEAL_STATUS_META } from './dealStatusMeta';
import styles from './DealSourceActions.module.css';

export function DealManagementPanel({ details, settlements }: { details: DealDetails; settlements: DealSettlement[] }) {
  return <>
    {transferAdjustable(details) ? <TransferAdjustment key={details.updatedAt} details={details} /> : null}
    {workflowStatuses(details).length ? <WorkflowActions details={details} /> : null}
    {details.paymentWatchId ? <section className={styles.panel}>
      <h2 className={styles.heading}>Наблюдение за оплатой</h2>
      <p className={styles.meta}>Наблюдение #{details.paymentWatchId}: {details.paymentWatchStatus ?? 'Нет данных'}</p>
      {details.tronscanUrl?.startsWith('https://tronscan.org/#/transaction/') ? <a href={details.tronscanUrl} target="_blank" rel="noopener noreferrer">Транзакция в Tronscan</a> : null}
    </section> : null}
    {settlements.map((item) => <SettlementCard key={`${item.id}:${item.status}`} dealId={details.deal.id} item={item} />)}
  </>;
}

function TransferAdjustment({ details }: { details: DealDetails }) {
  const [amount, setAmount] = useState(String(details.body?.amount ?? ''));
  const [state, setState] = useState<DealActionState>({});
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState<TransferAdjustmentRequest | null>(null);
  const key = useRef<{ signature: string; value: string } | null>(null);

  async function submit(newAmount: string | null, allowNegative = false) {
    if (pending) return;
    let normalized: string | null;
    try { normalized = newAmount === null ? null : positiveDecimal(newAmount); }
    catch (error) { setState({ error: (error as Error).message }); return; }
    if (!allowNegative && !window.confirm(newAmount === null
      ? 'Отменить перевод? Средства вернутся отправителю и спишутся у получателя.'
      : 'Изменить сумму перевода? Будет проведена только разница и отправлены новые чеки.')) return;
    const signature = JSON.stringify([normalized, details.body?.amount]);
    if (key.current?.signature !== signature) key.current = { signature, value: crypto.randomUUID() };
    const payload: TransferAdjustmentRequest = {
      newAmount: normalized, expectedAmount: String(details.body?.amount),
      idempotencyKey: key.current.value, allowNegative,
    };
    setPending(true);
    setState({});
    try {
      const result = await adjustTransferAction(details.deal.id, payload);
      setState(result);
      setConfirmation(result.insufficient ? payload : null);
      if (result.success) key.current = null;
    } catch {
      setState({ error: 'Не удалось получить ответ сервера. Обновите карточку или повторите то же действие: повторный запрос не создаст двойную проводку.' });
    } finally { setPending(false); }
  }

  return <section className={styles.panel}>
    <h2 className={styles.heading}>Корректировка перевода</h2>
    <p className={styles.meta}>Валюта и получатель не меняются. Корректировка сохраняется в истории; оба чата получают уведомления.</p>
    <label className={styles.field}><span>Новая сумма, {String(details.body?.currency ?? '')}</span>
      <input inputMode="decimal" value={amount} disabled={pending} onChange={(event) => {
        setAmount(event.target.value); setState({}); setConfirmation(null); key.current = null;
      }} />
    </label>
    <Feedback state={state} />
    {confirmation ? <div className={styles.panel} role="alert">
      <p className={styles.meta}>Операция увеличит долг отправителя или потребует возврата средств с недостаточного баланса получателя. Подтвердить?</p>
      <div className={styles.formFooter}>
        <button className={styles.dangerButton} disabled={pending} onClick={() => void submit(confirmation.newAmount, true)}>Подтвердить отрицательный баланс</button>
        <button className={styles.primaryButton} disabled={pending} onClick={() => { setConfirmation(null); setState({}); key.current = null; }}>Отклонить</button>
      </div>
    </div> : <div className={styles.formFooter}>
      <button className={styles.primaryButton} disabled={pending} onClick={() => void submit(amount)}>Изменить сумму</button>
      <button className={styles.dangerButton} disabled={pending} onClick={() => void submit(null)}>Отменить перевод</button>
    </div>}
  </section>;
}

function WorkflowActions({ details }: { details: DealDetails }) {
  const [state, action, pending] = useActionState(
    changeStatusAction.bind(null, details.deal.id, details.deal.status), {},
  );
  return <section className={styles.panel}>
    <h2 className={styles.heading}>Платёжный статус</h2>
    <form action={action} className={styles.form}>
      <label className={styles.field}><span>Следующее действие</span>
        <select name="status">{workflowStatuses(details).map((status) => <option key={status} value={status}>{DEAL_STATUS_META[status].label}</option>)}</select>
      </label>
      <label className={styles.field}><span>ID наблюдения (для ожидания оплаты)</span><input name="paymentWatchId" inputMode="numeric" defaultValue={details.paymentWatchId ?? ''} /></label>
      <label className={styles.field}><span>Комментарий</span><input name="comment" /></label>
      <Feedback state={state} />
      <button className={styles.primaryButton} disabled={pending}>Применить статус</button>
    </form>
  </section>;
}

function SettlementCard({ dealId, item }: { dealId: string; item: DealSettlement }) {
  const [state, action, pending] = useActionState(resolveSettlementAction.bind(null, dealId, item.id), {});
  return <section className={styles.panel}>
    <h2 className={styles.heading}>Платёж #{item.id}: {item.status === 'needs_review' ? 'Требует проверки' : item.status === 'resolved' ? 'Решение принято' : 'Сумма совпала'}</h2>
    <p>Ожидалось: {item.expected} {item.currency} · Фактически: {item.actual} {item.currency} · Разница: {item.delta}</p>
    {item.txHash ? <a href={`https://tronscan.org/#/transaction/${encodeURIComponent(item.txHash)}`} target="_blank" rel="noopener noreferrer">Транзакция в Tronscan</a> : null}
    {item.resolution ? <p className={styles.meta}>Решение: {item.resolution === 'accept_actual' ? 'Принять фактическую сумму' : item.resolution === 'amend_unposted' ? 'Уточнить заявку по факту' : 'Отмена и новая заявка'}</p> : null}
    {item.status === 'needs_review' ? <form action={action} className={styles.form} onSubmit={(event) => {
      if (!window.confirm('Подтвердить решение по фактическому платежу? Сделка будет завершена по правилам учёта.')) event.preventDefault();
    }}>
      <label className={styles.field}><span>Решение</span><select name="resolution">
        <option value="accept_actual">Принять факт, сохранив условия заявки</option>
        <option value="amend_unposted">Уточнить непроведённую заявку по факту</option>
      </select></label>
      <label className={`${styles.field} ${styles.wide}`}><span>Основание решения</span><input name="comment" required /></label>
      <Feedback state={state} />
      <button className={styles.primaryButton} disabled={pending}>Сохранить решение</button>
    </form> : null}
  </section>;
}

export function Feedback({ state }: { state: DealActionState }) {
  return state.error ? <p className={styles.error} role="alert">{state.error}</p>
    : state.success ? <p className={styles.success} role="status">{state.success}</p> : null;
}
