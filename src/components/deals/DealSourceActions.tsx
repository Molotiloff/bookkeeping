'use client';

import { useActionState } from 'react';
import type { FormEvent } from 'react';
import {
  cancelDealAction,
  editDealSourceAction,
  writeDealToTableAction,
  payReferrerSpreadAction,
  type DealActionState,
} from '@/app/deals/[id]/actions';
import type { DealDetails } from '@/types/deals';
import { Icon } from '@/components/ui/Icon';
import styles from './DealSourceActions.module.css';
import { sourceEditable } from '@/lib/dealManagement';
import { readyCashAction } from '@/app/deals/[id]/actions';

const INITIAL_STATE: DealActionState = {};

export function DealSourceActions({ details }: { details: DealDetails }) {
  const editAction = editDealSourceAction.bind(null, details.deal.id);
  const cancelAction = cancelDealAction.bind(null, details.deal.id);
  const [editState, submitEdit, editing] = useActionState(editAction, INITIAL_STATE);
  const [cancelState, submitCancel, canceling] = useActionState(cancelAction, INITIAL_STATE);
  const [tableState, submitTable, writingTable] = useActionState(
    writeDealToTableAction.bind(null, details.deal.id), INITIAL_STATE,
  );
  const body = details.body ?? {};
  const [spreadState, submitSpread, payingSpread] = useActionState(
    payReferrerSpreadAction.bind(null, details.deal.id, {
      expectedAmount: String(details.referrerRewardRub ?? 0),
      referrerClientId: Number(body.referrer_client_id),
    }), INITIAL_STATE,
  );
  const spreadPayment = body.referrer_spread_payment as { status?: string; amount_rub?: string } | undefined;
  const spreadPaid = spreadPayment?.status === 'paid';
  const requestKind = text(body.request_kind);
  const isExchange = details.sourceKind === 'exchange';
  const isFulfillment = details.sourceKind === 'fulfillment';
  const [readyState, submitReady, readyPending] = useActionState(readyCashAction.bind(null, details.deal.id), INITIAL_STATE);

  const confirmCancel = (event: FormEvent<HTMLFormElement>) => {
    if (!window.confirm(isFulfillment
      ? 'Отменить заявку /отпр и остановить наблюдение? Если транзакций не было, баланс не изменится.'
      : 'Отменить заявку и провести компенсирующие транзакции?')) {
      event.preventDefault();
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.headingRow}>
        <div>
          <h2 className={styles.heading}>Управление заявкой</h2>
          <p className={styles.meta}>{isExchange ? 'Обменная заявка' : isFulfillment ? 'Заявка /отпр на перевод USDT' : 'Кассовая заявка'}</p>
        </div>
      </div>

      {details.sourceKind === 'cash' && details.deal.status === 'new' ? (
        <form action={submitReady} className={styles.formFooter}>
          <ActionMessage state={readyState} />
          <button className={styles.primaryButton} disabled={readyPending}>Готово к расчёту</button>
        </form>
      ) : null}
      {details.sourceKind === 'cash' && details.deal.status === 'ready_for_cash_settlement' ? (
        <p className={styles.meta}>Ожидаем фактическую кассовую проводку по номеру заявки. Изменение статуса не заменяет расчёт.</p>
      ) : null}

      <div className={styles.formFooter}>
      {isExchange && details.deal.status === 'new' &&
       ['Продажа', 'Покупка', 'Конвертация'].includes(details.deal.dealType) ? (
        <form action={submitTable} className={styles.formFooter}>
          <ActionMessage state={tableState} />
          <button type="submit" className={styles.primaryButton} disabled={writingTable}>
            <Icon name="check-circle" size={16} />
            {writingTable ? 'Заносим…' : 'Занести в таблицу'}
          </button>
        </form>
      ) : null}

      {isExchange && ['Продажа', 'Покупка'].includes(details.deal.dealType)
        && details.deal.status !== 'canceled' && (details.referrerRewardRub ?? 0) > 0 ? (
        <form action={submitSpread} className={styles.formFooter} onSubmit={(event) => {
          if (!window.confirm(`Зачислить КТ ${details.referrerRewardRub} RUB на баланс?`)) event.preventDefault();
        }}>
          <ActionMessage state={spreadState} />
          <button type="submit" className={styles.primaryButton} disabled={payingSpread || spreadPaid}>
            {spreadPaid ? `Спред КТ переведён: ${spreadPayment?.amount_rub} RUB` : payingSpread ? 'Переводим…' : 'Перевести спред КТ'}
          </button>
        </form>
      ) : null}

      </div>
      {spreadPayment?.status === 'reversed' ? <p className={styles.meta}>Спред КТ возвращён при отмене сделки: {spreadPayment.amount_rub} RUB</p> : null}

      {sourceEditable(details) ? <form action={submitEdit} className={styles.form}>
        <input type="hidden" name="sourceKind" value={details.sourceKind} />
        <input type="hidden" name="requestKind" value={requestKind} />
        {isExchange ? <ExchangeFields body={body} /> : <CashFields body={body} requestKind={requestKind} city={details.deal.city} />}
        <label className={`${styles.field} ${styles.wide}`}>
          <span>Комментарий</span>
          <input name="note" defaultValue={text(body.note) || details.comment || ''} />
        </label>
        <div className={styles.formFooter}>
          <ActionMessage state={editState} />
          <button type="submit" className={styles.primaryButton} disabled={editing}>
            <Icon name="check-circle" size={16} />
            {editing ? 'Сохраняем…' : 'Сохранить изменения'}
          </button>
        </div>
      </form> : null}

      {!['done', 'canceled'].includes(details.deal.status) && (details.source === 'tg_bot' || details.source === 'crm') ?
      <form action={submitCancel} className={styles.cancelRow} onSubmit={confirmCancel}>
        <label className={styles.cancelComment}>
          <span>Причина отмены</span>
          <input name="cancelComment" placeholder="Необязательно" />
        </label>
        <ActionMessage state={cancelState} />
        <button type="submit" className={styles.dangerButton} disabled={canceling}>
          <Icon name="x-circle" size={16} />
          {canceling ? 'Отменяем…' : 'Отменить заявку'}
        </button>
      </form> : null}
    </section>
  );
}

function ExchangeFields({ body }: { body: Record<string, unknown> }) {
  return (
    <>
      <Field label="Получаем, валюта" name="recvCode" value={text(body.recv_code)} />
      <Field label="Получаем, сумма" name="recvAmount" value={text(body.recv_amount)} numeric />
      <Field label="Отдаём, валюта" name="payCode" value={text(body.pay_code)} />
      <Field label="Отдаём, сумма" name="payAmount" value={text(body.pay_amount)} numeric />
      <Field label="Курс" name="rate" value={text(body.rate)} numeric />
    </>
  );
}

function CashFields({ body, requestKind, city }: { body: Record<string, unknown>; requestKind: string; city: string }) {
  return (
    <>
      <input type="hidden" name="city" value={city} />
      <p className={styles.meta}>Город: {city}. Перенос заявки в другой город пока недоступен.</p>
      {requestKind === 'fx' ? (
        <>
          <Field label={`Принимаем, ${text(body.in_code)}`} name="inAmount" value={text(body.in_amount)} numeric />
          <Field label={`Выдаём, ${text(body.out_code)}`} name="outAmount" value={text(body.out_amount)} numeric />
        </>
      ) : (
        <Field label={`Сумма, ${text(body.currency)}`} name="amount" value={text(body.amount)} numeric />
      )}
      <Field label="Контакт 1" name="contact1" value={text(body.contact1)} required={false} />
      <Field label="Контакт 2" name="contact2" value={text(body.contact2)} required={false} />
    </>
  );
}

function Field({ label, name, value, numeric = false, required = true }: { label: string; name: string; value: string; numeric?: boolean; required?: boolean }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input name={name} defaultValue={value} inputMode={numeric ? 'decimal' : undefined} required={required} />
    </label>
  );
}

function ActionMessage({ state }: { state: DealActionState }) {
  if (state.error) return <span className={styles.error}>{state.error}</span>;
  if (state.success) return <span className={styles.success}>{state.success}</span>;
  return <span />;
}

function text(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}
