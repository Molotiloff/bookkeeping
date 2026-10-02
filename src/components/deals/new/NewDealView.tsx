'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCash, createClientTransfer, createExchange } from '@/app/deals/new/actions';
import type { NewDealContext, NewDealType } from '@/types/newDeal';
import { NewDealHeader } from './NewDealHeader';
import { BaseDealFormCard, type BaseFormState } from './BaseDealFormCard';
import { DealTypeTabs } from './DealTypeTabs';
import { DealDataCard } from './DealDataCard';
import { AutoCalcCard } from './AutoCalcCard';
import {
  NEW_DEAL_TYPES,
  TYPE_FIELDS,
  calculateDeal,
  defaultValues,
  invalidFields,
} from './newDealConfig';
import styles from './NewDealView.module.css';

export function NewDealView({ context }: { context: NewDealContext }) {
  const router = useRouter();

  const [dealType, setDealType] = useState<NewDealType>('sale');
  const [base, setBase] = useState<BaseFormState>({
    city: context.cities[0] ?? '',
    counterpartyId: context.counterparties[0]?.id ?? '',
    referrerClientId: '',
    counterpartyPercent: '0.00',
    clientId: '',
    comment: '',
  });
  const [valuesByType, setValuesByType] = useState<Record<NewDealType, Record<string, string>>>(
    () =>
      Object.fromEntries(
        NEW_DEAL_TYPES.map((item) => [item.type, defaultValues(item.type, context)]),
      ) as Record<NewDealType, Record<string, string>>,
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [confirmNegative, setConfirmNegative] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const transferKey = useRef<string | null>(null);

  const values = valuesByType[dealType];

  const handleFieldChange = (name: string, value: string) => {
    transferKey.current = null;
    setConfirmNegative(false);
    setSubmitError('');
    setValuesByType((prev) => {
      const next = { ...prev[dealType], [name]: value };
      // Смена валюты фиксирует соответствующий курс компании
      if (name === 'currency' && TYPE_FIELDS[dealType].some((f) => f.name === 'companyRate')) {
        const rate = context.companyRates[value];
        if (rate !== undefined) next.companyRate = String(rate);
      }
      return { ...prev, [dealType]: next };
    });
    setErrors((prev) => prev.filter((errorName) => errorName !== name));
  };

  const handleTypeChange = (type: NewDealType) => {
    setDealType(type);
    setErrors([]);
    setConfirmNegative(false);
    setSubmitError('');
    transferKey.current = null;
  };

  const calcRows = useMemo(() => calculateDeal(dealType, values), [dealType, values]);

  const handleSubmit = async (allowNegative = false) => {
    if (submitting) return;
    const invalid = invalidFields(dealType, values);
    if (dealType === 'client_transfer' && !base.clientId) invalid.push('fromClientId');
    if (['sale', 'purchase', 'deposit', 'withdrawal'].includes(dealType) && !base.clientId) invalid.push('clientId');
    if (dealType === 'client_transfer' && base.clientId === values.toClientId) {
      setSubmitError('Отправитель и получатель должны быть разными клиентами');
      return;
    }
    if (dealType === 'sale' || dealType === 'purchase') {
      const percent = Number.parseFloat(base.counterpartyPercent.replace(',', '.'));
      if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
        setSubmitError('Процент КТ должен быть от 0 до 100');
        return;
      }
      if (percent > 0 && !base.referrerClientId) {
        setSubmitError('Для процента КТ выберите чат клиента-КТ');
        return;
      }
      if (base.referrerClientId && base.referrerClientId === base.clientId) {
        setSubmitError('Клиент и КТ должны быть разными чатами');
        return;
      }
    }
    if (invalid.length > 0) {
      setErrors(invalid);
      setSubmitError('Выберите клиента и укажите положительные суммы');
      return;
    }

    if (dealType === 'client_transfer') {
      setSubmitting(true);
      setSubmitError('');
      transferKey.current ??= crypto.randomUUID();
      const result = await createClientTransfer({
        fromClientId: Number(base.clientId),
        toClientId: Number(values.toClientId),
        amount: values.amount.trim().replace(',', '.'),
        currency: values.currency,
        idempotencyKey: transferKey.current,
        comment: base.comment.trim() || null,
        allowNegative,
      });
      setSubmitting(false);
      if (result.ok) {
        router.push(`/deals/${result.dealId}`);
        return;
      }
      setSubmitError(result.message);
      setConfirmNegative(result.insufficient);
      return;
    }

    if (dealType === 'sale' || dealType === 'purchase') {
      setSubmitting(true);
      setSubmitError('');
      transferKey.current ??= crypto.randomUUID();
      const foreign = values.quantity.trim().replace(',', '.');
      const rub = values.clientAmount.trim().replace(',', '.');
      const result = await createExchange({
        dealType,
        clientId: Number(base.clientId),
        city: base.city,
        recvCode: dealType === 'sale' ? 'RUB' : values.currency,
        recvAmount: dealType === 'sale' ? rub : foreign,
        payCode: dealType === 'sale' ? values.currency : 'RUB',
        payAmount: dealType === 'sale' ? foreign : rub,
        idempotencyKey: transferKey.current,
        comment: base.comment.trim() || null,
        referrerClientId: base.referrerClientId ? Number(base.referrerClientId) : null,
        referrerPercent: Number.parseFloat(base.counterpartyPercent.replace(',', '.')) || 0,
      });
      setSubmitting(false);
      if (result.ok) {
        if (!result.requestChatPosted) {
          window.alert('Сделка создана, но отправку в чат заявок не удалось подтвердить. Проверьте Telegram и не создавайте сделку повторно.');
        }
        router.push(`/deals/${result.dealId}`);
      } else {
        setSubmitError(result.message);
      }
      return;
    }

    if (dealType === 'deposit' || dealType === 'withdrawal') {
      const time = values.time.trim();
      if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
        setErrors(['time']);
        setSubmitError('Укажите время в формате ЧЧ:ММ');
        return;
      }
      setSubmitting(true);
      setSubmitError('');
      transferKey.current ??= crypto.randomUUID();
      const result = await createCash({
        dealType,
        clientId: Number(base.clientId),
        city: base.city,
        currency: values.currency,
        amount: values.amount.trim().replace(',', '.'),
        idempotencyKey: transferKey.current,
        comment: base.comment.trim() || null,
        time: time || null,
        contact1: values.contact1.trim() || null,
        contact2: values.contact2.trim() || null,
      });
      setSubmitting(false);
      if (result.ok) {
        if (!result.requestChatPosted) {
          window.alert('Заявка создана, но отправку в чат предстоящих сделок не удалось подтвердить. Проверьте Telegram и не создавайте заявку повторно.');
        }
        router.push(`/deals/${result.dealId}`);
      } else {
        setSubmitError(result.message);
      }
      return;
    }

    setSubmitError('Этот тип сделки пока не подключён к CRM. Сейчас доступны покупка, продажа, внесение, выдача и перевод.');
  };

  return (
    <>
      <NewDealHeader onSubmit={() => void handleSubmit()} />

      <BaseDealFormCard
        context={context}
        base={base}
        onBaseChange={(patch) => {
          transferKey.current = null;
          setConfirmNegative(false);
          setSubmitError('');
          setBase((prev) => ({ ...prev, ...patch }));
        }}
        dealType={dealType}
        onDealTypeChange={handleTypeChange}
      />

      <DealTypeTabs active={dealType} onChange={handleTypeChange} />

      {submitError ? (
        <div className={styles.message} role="alert">
          <span>{submitError}</span>
          {confirmNegative ? (
            <span className={styles.messageActions}>
              <button type="button" disabled={submitting} onClick={() => void handleSubmit(true)}>
                Подтвердить перевод
              </button>
              <button type="button" disabled={submitting} onClick={() => {
                setConfirmNegative(false);
                setSubmitError('Перевод отклонён');
                transferKey.current = null;
              }}>
                Отклонить
              </button>
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={styles.grid}>
        <DealDataCard
          context={context}
          dealType={dealType}
          values={values}
          errors={errors}
          onFieldChange={handleFieldChange}
        />
        <AutoCalcCard rows={calcRows} showRateNotice={
          !['client_transfer', 'sale', 'purchase', 'deposit', 'withdrawal'].includes(dealType)
        } />
      </div>
    </>
  );
}
