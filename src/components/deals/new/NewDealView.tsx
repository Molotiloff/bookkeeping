'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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

  const values = valuesByType[dealType];

  const handleFieldChange = (name: string, value: string) => {
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
  };

  const calcRows = useMemo(() => calculateDeal(dealType, values), [dealType, values]);

  const handleSubmit = () => {
    const invalid = invalidFields(dealType, values);
    if (invalid.length > 0) {
      setErrors(invalid);
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
      <NewDealHeader onSubmit={handleSubmit} />

      <BaseDealFormCard
        context={context}
        base={base}
        onBaseChange={(patch) => setBase((prev) => ({ ...prev, ...patch }))}
        dealType={dealType}
        onDealTypeChange={handleTypeChange}
      />

      <DealTypeTabs active={dealType} onChange={handleTypeChange} />

      <div className={styles.grid}>
        <DealDataCard
          context={context}
          dealType={dealType}
          values={values}
          errors={errors}
          onFieldChange={handleFieldChange}
        />
        <AutoCalcCard rows={calcRows} />
      </div>
    </>
  );
}
