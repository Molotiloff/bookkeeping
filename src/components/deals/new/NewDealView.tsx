'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientTransfer } from '@/app/deals/new/actions';
import type { CreateDealPayload, NewDealContext, NewDealType } from '@/types/newDeal';
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
  parseFields,
} from './newDealConfig';
import styles from './NewDealView.module.css';

export function NewDealView({ context }: { context: NewDealContext }) {
  const router = useRouter();

  const [dealType, setDealType] = useState<NewDealType>('sale');
  const [base, setBase] = useState<BaseFormState>({
    city: context.cities[0] ?? '',
    counterpartyId: context.counterparties[0]?.id ?? '',
    counterpartyPercent: context.defaultCounterpartyPercent.toFixed(2),
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
    if (dealType === 'client_transfer' && base.clientId === values.toClientId) {
      setSubmitError('Отправитель и получатель должны быть разными клиентами');
      return;
    }
    if (invalid.length > 0) {
      setErrors(invalid);
      setSubmitError('Выберите отправителя и получателя, укажите положительную сумму');
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

    const payload: CreateDealPayload = {
      base: {
        city: base.city,
        counterpartyId: base.counterpartyId,
        counterpartyPercent: Number.parseFloat(base.counterpartyPercent.replace(',', '.')) || 0,
        clientId: base.clientId || null,
        comment: base.comment,
      },
      type: dealType,
      fields: parseFields(dealType, values),
      calculations: Object.fromEntries(calcRows.map((row) => [row.key, row.value])),
    };

    // TODO: отправить payload в API создания сделки
    console.log('create deal payload', payload);
    router.push('/deals');
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
        <AutoCalcCard rows={calcRows} showRateNotice={dealType !== 'client_transfer'} />
      </div>
    </>
  );
}
