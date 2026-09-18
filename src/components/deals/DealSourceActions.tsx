'use client';

import { useActionState } from 'react';
import type { FormEvent } from 'react';
import {
  cancelDealAction,
  editDealSourceAction,
  type DealActionState,
} from '@/app/deals/[id]/actions';
import type { DealDetails } from '@/types/deals';
import { Icon } from '@/components/ui/Icon';
import styles from './DealSourceActions.module.css';

const INITIAL_STATE: DealActionState = {};

export function DealSourceActions({ details }: { details: DealDetails }) {
  const editAction = editDealSourceAction.bind(null, details.deal.id);
  const cancelAction = cancelDealAction.bind(null, details.deal.id);
  const [editState, submitEdit, editing] = useActionState(editAction, INITIAL_STATE);
  const [cancelState, submitCancel, canceling] = useActionState(cancelAction, INITIAL_STATE);
  const body = details.body ?? {};
  const requestKind = text(body.request_kind);
  const isExchange = details.sourceKind === 'exchange';

  const confirmCancel = (event: FormEvent<HTMLFormElement>) => {
    if (!window.confirm('Отменить заявку и провести компенсирующие транзакции?')) {
      event.preventDefault();
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.headingRow}>
        <div>
          <h2 className={styles.heading}>Управление заявкой</h2>
          <p className={styles.meta}>{isExchange ? 'Обмен из Telegram' : 'Кассовая заявка из Telegram'}</p>
        </div>
      </div>

      <form action={submitEdit} className={styles.form}>
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
      </form>

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
      </form>
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
      <Field label="Город" name="city" value={city} />
      {requestKind === 'fx' ? (
        <>
          <Field label={`Принимаем, ${text(body.in_code)}`} name="inAmount" value={text(body.in_amount)} numeric />
          <Field label={`Выдаём, ${text(body.out_code)}`} name="outAmount" value={text(body.out_amount)} numeric />
        </>
      ) : (
        <Field label={`Сумма, ${text(body.currency)}`} name="amount" value={text(body.amount)} numeric />
      )}
      <Field label="Контакт 1" name="contact1" value="" required={false} />
      <Field label="Контакт 2" name="contact2" value="" required={false} />
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
