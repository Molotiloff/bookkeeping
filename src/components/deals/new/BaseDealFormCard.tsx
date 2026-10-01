'use client';

import { Icon } from '@/components/ui/Icon';
import type { NewDealContext, NewDealType } from '@/types/newDeal';
import { NEW_DEAL_TYPES } from './newDealConfig';
import { SearchableSelect } from './SearchableSelect';
import controls from './formControls.module.css';
import styles from './BaseDealFormCard.module.css';

export interface BaseFormState {
  city: string;
  counterpartyId: string;
  referrerClientId: string;
  counterpartyPercent: string;
  clientId: string;
  comment: string;
}

interface BaseDealFormCardProps {
  context: NewDealContext;
  base: BaseFormState;
  onBaseChange: (patch: Partial<BaseFormState>) => void;
  dealType: NewDealType;
  onDealTypeChange: (type: NewDealType) => void;
}

export function BaseDealFormCard({
  context,
  base,
  onBaseChange,
  dealType,
  onDealTypeChange,
}: BaseDealFormCardProps) {
  const handleNewClient = () => {
    // TODO: открыть форму создания клиента
    console.log('create client');
  };

  return (
    <section className={styles.card}>
      <div className={styles.topGrid}>
        <div className={controls.field}>
          <span className={controls.label}>Город</span>
          <span className={controls.control}>
            <select
              className={`${controls.input} ${controls.select}`}
              value={base.city}
              onChange={(event) => onBaseChange({ city: event.target.value })}
              aria-label="Город"
            >
              {context.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} className={controls.chevron} />
          </span>
        </div>

        <div className={controls.field}>
          <span className={controls.label}>Тип сделки</span>
          <span className={controls.control}>
            <select
              className={`${controls.input} ${controls.select}`}
              value={dealType}
              onChange={(event) => onDealTypeChange(event.target.value as NewDealType)}
              aria-label="Тип сделки"
            >
              {NEW_DEAL_TYPES.map((item) => (
                <option key={item.type} value={item.type}>
                  {item.label}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} className={controls.chevron} />
          </span>
        </div>

        {dealType !== 'client_transfer' ? <div className={controls.field}>
          <span className={controls.label}>{['sale', 'purchase'].includes(dealType) ? 'КТ (чат клиента)' : 'Контрагент'}</span>
          <SearchableSelect
            value={['sale', 'purchase'].includes(dealType) ? base.referrerClientId : base.counterpartyId}
            options={['sale', 'purchase'].includes(dealType) ? context.clients : context.counterparties}
            onChange={(id) => onBaseChange(
              ['sale', 'purchase'].includes(dealType) ? { referrerClientId: id } : { counterpartyId: id },
            )}
            placeholder="Начните вводить имя"
            label="Контрагент"
          />
        </div> : null}

        {dealType !== 'client_transfer' ? <div className={controls.field}>
          <span className={controls.label}>Процент КТ</span>
          <span className={controls.control}>
            <input
              type="text"
              inputMode="decimal"
              className={`${controls.input} ${controls.withSuffix}`}
              value={base.counterpartyPercent}
              onChange={(event) => onBaseChange({ counterpartyPercent: event.target.value })}
              aria-label="Процент КТ"
            />
            <span className={controls.suffix}>%</span>
          </span>
        </div> : null}
      </div>

      <div className={styles.bottomGrid}>
        <div className={controls.field}>
          <span className={styles.clientLabelRow}>
            <span className={controls.label}>{dealType === 'client_transfer' ? 'Отправитель' : 'Клиент'}</span>
            {dealType !== 'client_transfer' ? (
              <button type="button" className={styles.newClientButton} onClick={handleNewClient}>
                + Новый
              </button>
            ) : null}
          </span>
          <SearchableSelect
            value={base.clientId}
            options={context.clients}
            onChange={(id) => onBaseChange({ clientId: id })}
            placeholder="Начните вводить клиента"
            label={dealType === 'client_transfer' ? 'Отправитель' : 'Клиент'}
          />
        </div>

        <div className={controls.field}>
          <span className={controls.label}>Комментарий</span>
          <textarea
            className={controls.textarea}
            placeholder="Введите комментарий"
            value={base.comment}
            onChange={(event) => onBaseChange({ comment: event.target.value })}
            aria-label="Комментарий"
          />
        </div>
      </div>
    </section>
  );
}
