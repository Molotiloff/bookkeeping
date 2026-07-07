'use client';

import { Icon } from '@/components/ui/Icon';
import type { NewDealContext, NewDealType } from '@/types/newDeal';
import { TYPE_FIELDS, fieldOptions, hasReceipt, type FieldConfig } from './newDealConfig';
import controls from './formControls.module.css';
import styles from './DealDataCard.module.css';

interface DealDataCardProps {
  context: NewDealContext;
  dealType: NewDealType;
  values: Record<string, string>;
  errors: string[];
  onFieldChange: (name: string, value: string) => void;
}

function resolveSuffix(field: FieldConfig, values: Record<string, string>): string | undefined {
  if (field.suffix === 'currency') return values.currency ?? values.fromCurrency;
  return field.suffix;
}

export function DealDataCard({ context, dealType, values, errors, onFieldChange }: DealDataCardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>Данные сделки</h2>

      <div className={styles.fields}>
        {TYPE_FIELDS[dealType].map((field) => {
          const suffix = resolveSuffix(field, values);
          const hasError = errors.includes(field.name);

          return (
            <div key={field.name} className={controls.field}>
              <span className={controls.label}>{field.label}</span>
              <span className={controls.control}>
                {field.kind === 'select' ? (
                  <>
                    <select
                      className={`${controls.input} ${controls.select}`}
                      value={values[field.name] ?? ''}
                      onChange={(event) => onFieldChange(field.name, event.target.value)}
                      aria-label={field.label}
                    >
                      {fieldOptions(field, context).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <Icon name="chevron-down" size={14} className={controls.chevron} />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      inputMode={field.kind === 'number' ? 'decimal' : undefined}
                      className={`${controls.input} ${suffix ? controls.withSuffix : ''} ${
                        hasError ? controls.inputError : ''
                      }`}
                      placeholder={field.placeholder ?? '0'}
                      value={values[field.name] ?? ''}
                      onChange={(event) => onFieldChange(field.name, event.target.value)}
                      aria-label={field.label}
                      aria-invalid={hasError || undefined}
                    />
                    {suffix ? <span className={controls.suffix}>{suffix}</span> : null}
                  </>
                )}
              </span>
            </div>
          );
        })}

        {hasReceipt(dealType) ? (
          <div className={controls.field}>
            <span className={controls.label}>Чек / TxID (если расчёты в USDT)</span>
            <div className={styles.receiptBox}>
              <span className={styles.receiptTitle}>
                <Icon name="paperclip" size={14} />
                Прикрепить чек или вставить ссылку
              </span>
              <span className={styles.receiptHint}>
                Поддерживаются ссылки от <span className={styles.receiptLink}>Tronscan</span>
              </span>
              <input
                type="text"
                className={`${controls.input} ${styles.receiptInput}`}
                placeholder="Вставьте ссылку на транзакцию"
                value={values.txUrl ?? ''}
                onChange={(event) => onFieldChange('txUrl', event.target.value)}
                aria-label="Ссылка на транзакцию"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
