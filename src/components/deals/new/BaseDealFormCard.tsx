'use client';

import { Icon } from '@/components/ui/Icon';
import type { NewDealContext, NewDealType } from '@/types/newDeal';
import { NEW_DEAL_TYPES } from './newDealConfig';
import controls from './formControls.module.css';
import styles from './BaseDealFormCard.module.css';

export interface BaseFormState {
  city: string;
  counterpartyId: string;
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

        <div className={controls.field}>
          <span className={controls.label}>Контрагент</span>
          <span className={controls.control}>
            <select
              className={`${controls.input} ${controls.select}`}
              value={base.counterpartyId}
              onChange={(event) => onBaseChange({ counterpartyId: event.target.value })}
              aria-label="Контрагент"
            >
              {context.counterparties.map((counterparty) => (
                <option key={counterparty.id} value={counterparty.id}>
                  {counterparty.name}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} className={controls.chevron} />
          </span>
        </div>

        <div className={controls.field}>
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
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={controls.field}>
          <span className={styles.clientLabelRow}>
            <span className={controls.label}>Клиент</span>
            <button type="button" className={styles.newClientButton} onClick={handleNewClient}>
              + Новый
            </button>
          </span>
          <span className={controls.control}>
            <select
              className={`${controls.input} ${controls.select}`}
              value={base.clientId}
              onChange={(event) => onBaseChange({ clientId: event.target.value })}
              aria-label="Клиент"
            >
              <option value="">Выберите клиента</option>
              {context.clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} className={controls.chevron} />
          </span>
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
