'use client';

import { Icon } from '@/components/ui/Icon';
import type { NewDealContext, NewDealType } from '@/types/newDeal';
import { TYPE_FIELDS, fieldOptions, type FieldConfig } from './newDealConfig';
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
                      {field.optionsFrom === 'clients' ? <option value="">Выберите клиента</option> : null}
                      {fieldOptions(field, context).map((option) => (
                        <option key={option} value={option}>
                          {field.optionsFrom === 'clients'
                            ? context.clients.find((client) => client.id === option)?.name ?? option
                            : option}
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

      </div>
    </section>
  );
}
