import type { IconName } from '@/components/ui/Icon';
import type { CreateDealPayload, NewDealContext, NewDealType } from '@/types/newDeal';
import { formatCrypto, formatMoneyRub } from '@/lib/format';

/**
 * Конфигурация формы создания сделки: табы типов, наборы полей
 * и авторасчёт. Новый тип сделки = новая запись в этих map.
 */

export const NEW_DEAL_TYPES: { type: NewDealType; label: string; icon: IconName }[] = [
  { type: 'sale', label: 'Продажа', icon: 'deals' },
  { type: 'purchase', label: 'Покупка', icon: 'wallet' },
  { type: 'cash_in', label: 'Внесение', icon: 'income' },
  { type: 'cash_out', label: 'Выдача', icon: 'expenses' },
  { type: 'delivery', label: 'Доставка', icon: 'plane' },
  { type: 'rearrangement', label: 'Перестановка', icon: 'shuffle' },
  { type: 'conversion', label: 'Конвертация', icon: 'repeat' },
  { type: 'yuan', label: 'Юань', icon: 'yuan' },
  { type: 'invoice', label: 'Инвойс', icon: 'file-text' },
  { type: 'profit', label: 'Прибыль', icon: 'coins' },
];

export interface FieldConfig {
  name: string;
  label: string;
  kind: 'number' | 'select' | 'text';
  /** Суффикс в поле: валюта, RUB, % ('currency' — подставить выбранную валюту) */
  suffix?: string;
  /** Источник опций селекта из контекста */
  optionsFrom?: 'currencies' | 'cities';
  placeholder?: string;
  /** Обязательное числовое поле (> 0) для валидации */
  required?: boolean;
  defaultValue?: string;
}

const CURRENCIES = ['USDT', 'BTC', 'ETH'];

const SALE_FIELDS: FieldConfig[] = [
  { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'currencies', defaultValue: 'USDT' },
  { name: 'companyRate', label: 'Вход (курс компании)', kind: 'number', suffix: 'RUB', required: true, defaultValue: '90.25' },
  { name: 'quantity', label: 'Количество', kind: 'number', suffix: 'currency', required: true, defaultValue: '3000' },
  { name: 'clientAmount', label: 'Выход (клиенту)', kind: 'number', suffix: 'RUB', required: true, defaultValue: '270000' },
];

export const TYPE_FIELDS: Record<NewDealType, FieldConfig[]> = {
  sale: SALE_FIELDS,
  purchase: SALE_FIELDS,
  cash_in: [
    { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'currencies', defaultValue: 'USDT' },
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'currency', required: true },
  ],
  cash_out: [
    { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'currencies', defaultValue: 'USDT' },
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'currency', required: true },
  ],
  delivery: [
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'RUB', required: true },
    { name: 'feePercent', label: 'Комиссия', kind: 'number', suffix: '%', defaultValue: '1' },
  ],
  rearrangement: [
    { name: 'fromCity', label: 'Из города', kind: 'select', optionsFrom: 'cities' },
    { name: 'toCity', label: 'В город', kind: 'select', optionsFrom: 'cities' },
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'RUB', required: true },
    { name: 'feePercent', label: 'Комиссия', kind: 'number', suffix: '%', defaultValue: '0.5' },
  ],
  conversion: [
    { name: 'fromCurrency', label: 'Из валюты', kind: 'select', optionsFrom: 'currencies', defaultValue: 'USDT' },
    { name: 'toCurrency', label: 'В валюту', kind: 'select', optionsFrom: 'currencies', defaultValue: 'ETH' },
    { name: 'quantity', label: 'Количество', kind: 'number', suffix: 'currency', required: true },
    { name: 'rate', label: 'Курс конвертации', kind: 'number', required: true },
  ],
  yuan: [
    { name: 'amountCny', label: 'Сумма', kind: 'number', suffix: 'CNY', required: true },
    { name: 'rate', label: 'Курс', kind: 'number', suffix: 'RUB', required: true, defaultValue: '12.4' },
  ],
  invoice: [
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'RUB', required: true },
    { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'currencies', defaultValue: 'USDT' },
    { name: 'feePercent', label: 'Комиссия', kind: 'number', suffix: '%', defaultValue: '2' },
  ],
  profit: [{ name: 'amount', label: 'Прибыль', kind: 'number', suffix: 'RUB', required: true }],
};

/** У продажи и покупки есть блок «Чек / TxID» */
export function hasReceipt(type: NewDealType): boolean {
  return type === 'sale' || type === 'purchase';
}

export function fieldOptions(field: FieldConfig, context: NewDealContext): string[] {
  if (field.optionsFrom === 'cities') return context.cities;
  return CURRENCIES;
}

export function defaultValues(type: NewDealType, context: NewDealContext): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of TYPE_FIELDS[type]) {
    if (field.defaultValue !== undefined) {
      values[field.name] = field.defaultValue;
    } else if (field.kind === 'select') {
      values[field.name] = fieldOptions(field, context)[0];
    } else {
      values[field.name] = '';
    }
  }
  if (hasReceipt(type)) values.txUrl = '';
  return values;
}

export interface CalcRow {
  key: string;
  label: string;
  text: string;
  value: number;
  tone?: 'up' | 'down';
}

function num(values: Record<string, string>, name: string): number {
  const parsed = Number.parseFloat(values[name]?.replace(',', '.') ?? '');
  return Number.isFinite(parsed) ? parsed : 0;
}

function rubRow(key: string, label: string, value: number, tone?: 'up' | 'down'): CalcRow {
  return { key, label, text: formatMoneyRub(value), value, tone };
}

/** Авторасчёт по типу сделки; строки идут в карточку и в payload.calculations */
export function calculateDeal(type: NewDealType, values: Record<string, string>): CalcRow[] {
  switch (type) {
    case 'sale': {
      const buyTotal = num(values, 'quantity') * num(values, 'companyRate');
      const sellTotal = num(values, 'clientAmount');
      const spread = sellTotal - buyTotal;
      return [
        rubRow('buyTotal', 'Сумма покупки', buyTotal),
        rubRow('sellTotal', 'Сумма продажи', sellTotal),
        rubRow('spread', 'Спред', spread),
        rubRow('profit', 'Прибыль', -spread, -spread >= 0 ? 'up' : 'down'),
      ];
    }
    case 'purchase': {
      const buyTotal = num(values, 'clientAmount');
      const sellTotal = num(values, 'quantity') * num(values, 'companyRate');
      const profit = sellTotal - buyTotal;
      return [
        rubRow('buyTotal', 'Сумма покупки', buyTotal),
        rubRow('sellTotal', 'Сумма продажи', sellTotal),
        rubRow('spread', 'Спред', profit),
        rubRow('profit', 'Прибыль', profit, profit >= 0 ? 'up' : 'down'),
      ];
    }
    case 'cash_in':
    case 'cash_out': {
      const amount = num(values, 'amount');
      const currency = values.currency ?? 'USDT';
      return [
        {
          key: 'amount',
          label: type === 'cash_in' ? 'К внесению' : 'К выдаче',
          text: `${formatCrypto(amount, currency === 'BTC' || currency === 'ETH' ? (currency as 'BTC' | 'ETH') : 'USDT')} ${currency}`,
          value: amount,
        },
      ];
    }
    case 'delivery': {
      const amount = num(values, 'amount');
      const fee = (amount * num(values, 'feePercent')) / 100;
      return [
        rubRow('amount', 'Сумма', amount),
        rubRow('fee', 'Комиссия', fee),
        rubRow('total', 'Итого к оплате', amount + fee),
      ];
    }
    case 'rearrangement': {
      const amount = num(values, 'amount');
      const fee = (amount * num(values, 'feePercent')) / 100;
      return [
        rubRow('amount', 'Сумма', amount),
        rubRow('fee', 'Комиссия', fee),
        rubRow('total', 'К получению', amount - fee),
      ];
    }
    case 'conversion': {
      const quantity = num(values, 'quantity');
      const result = quantity * num(values, 'rate');
      const from = values.fromCurrency ?? 'USDT';
      const to = values.toCurrency ?? 'ETH';
      return [
        { key: 'give', label: 'Отдаём', text: `${quantity.toLocaleString('ru-RU')} ${from}`, value: quantity },
        { key: 'receive', label: 'Получаем', text: `${result.toLocaleString('ru-RU', { maximumFractionDigits: 6 })} ${to}`, value: result },
      ];
    }
    case 'yuan': {
      const amountCny = num(values, 'amountCny');
      const total = amountCny * num(values, 'rate');
      return [
        { key: 'amountCny', label: 'Сумма', text: `${amountCny.toLocaleString('ru-RU')} CNY`, value: amountCny },
        rubRow('total', 'Сумма в RUB', total),
      ];
    }
    case 'invoice': {
      const amount = num(values, 'amount');
      const fee = (amount * num(values, 'feePercent')) / 100;
      return [
        rubRow('amount', 'Сумма инвойса', amount),
        rubRow('fee', 'Комиссия', fee),
        rubRow('total', 'Итого', amount + fee),
      ];
    }
    case 'profit': {
      const amount = num(values, 'amount');
      return [rubRow('profit', 'Прибыль', amount, amount >= 0 ? 'up' : 'down')];
    }
  }
}

/** Числовые значения полей для payload; форма конфигурации гарантирует нужный набор ключей */
export function parseFields(
  type: NewDealType,
  values: Record<string, string>,
): CreateDealPayload['fields'] {
  const result: Record<string, string | number> = {};
  for (const field of TYPE_FIELDS[type]) {
    result[field.name] = field.kind === 'number' ? num(values, field.name) : (values[field.name] ?? '');
  }
  if (hasReceipt(type) && values.txUrl) result.txUrl = values.txUrl;
  return result as unknown as CreateDealPayload['fields'];
}

/** Имена обязательных полей с невалидным значением */
export function invalidFields(type: NewDealType, values: Record<string, string>): string[] {
  return TYPE_FIELDS[type]
    .filter((field) => field.required && !(num(values, field.name) > 0))
    .map((field) => field.name);
}
