import type { IconName } from '@/components/ui/Icon';
import type { CreateDealPayload, NewDealContext, NewDealType } from '@/types/newDeal';
import { formatMoneyRub } from '@/lib/format';
import { invoiceProfit, invoiceUsdt } from '@/lib/invoice';

/**
 * Конфигурация формы создания сделки: табы типов, наборы полей
 * и авторасчёт. Новый тип сделки = новая запись в этих map.
 */

export const NEW_DEAL_TYPES: { type: NewDealType; label: string; icon: IconName }[] = [
  { type: 'sale', label: 'Продажа', icon: 'deals' },
  { type: 'purchase', label: 'Покупка', icon: 'wallet' },
  { type: 'deposit', label: 'Внесение', icon: 'income' },
  { type: 'withdrawal', label: 'Выдача', icon: 'expenses' },
  { type: 'delivery', label: 'Доставка', icon: 'plane' },
  { type: 'transfer_city', label: 'Перестановка', icon: 'shuffle' },
  { type: 'client_transfer', label: 'Перевод', icon: 'repeat' },
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
  optionsFrom?: 'currencies' | 'exchangeCurrencies' | 'cashCurrencies' | 'cities' | 'clients' | 'transferCurrencies';
  placeholder?: string;
  /** Обязательное числовое поле (> 0) для валидации */
  required?: boolean;
  defaultValue?: string;
}

const CURRENCIES = ['USDT', 'BTC', 'ETH'];
const EXCHANGE_CURRENCIES = ['EUR', 'USD', 'USDT', 'EUR500', 'THB', 'USDW'];
const CASH_CURRENCIES = ['RUB', 'EUR', 'EUR500', 'USD', 'USDW', 'THB'];

const SALE_FIELDS: FieldConfig[] = [
  { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'exchangeCurrencies', defaultValue: 'USDT' },
  { name: 'clientAmount', label: 'Получаем', kind: 'number', suffix: 'RUB', required: true },
  { name: 'quantity', label: 'Отдаём', kind: 'number', suffix: 'currency', required: true },
];

const PURCHASE_FIELDS: FieldConfig[] = [
  { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'exchangeCurrencies', defaultValue: 'USDT' },
  { name: 'quantity', label: 'Получаем', kind: 'number', suffix: 'currency', required: true },
  { name: 'clientAmount', label: 'Отдаём', kind: 'number', suffix: 'RUB', required: true },
];

export const TYPE_FIELDS: Record<NewDealType, FieldConfig[]> = {
  sale: SALE_FIELDS,
  purchase: PURCHASE_FIELDS,
  deposit: [
    { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'cashCurrencies', defaultValue: 'RUB' },
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'currency', required: true },
    { name: 'time', label: 'Время', kind: 'text', placeholder: 'ЧЧ:ММ' },
    { name: 'contact1', label: 'Принимает', kind: 'text', placeholder: '@username или телефон' },
    { name: 'contact2', label: 'Выдает', kind: 'text', placeholder: '@username или телефон' },
  ],
  withdrawal: [
    { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'cashCurrencies', defaultValue: 'RUB' },
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'currency', required: true },
    { name: 'time', label: 'Время', kind: 'text', placeholder: 'ЧЧ:ММ' },
    { name: 'contact1', label: 'Выдает', kind: 'text', placeholder: '@username или телефон' },
    { name: 'contact2', label: 'Принимает', kind: 'text', placeholder: '@username или телефон' },
  ],
  delivery: [
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'RUB', required: true },
    { name: 'feePercent', label: 'Комиссия', kind: 'number', suffix: '%', defaultValue: '1' },
  ],
  transfer_city: [
    { name: 'fromCity', label: 'Из города', kind: 'select', optionsFrom: 'cities' },
    { name: 'toCity', label: 'В город', kind: 'select', optionsFrom: 'cities' },
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'RUB', required: true },
    { name: 'feePercent', label: 'Комиссия', kind: 'number', suffix: '%', defaultValue: '0.5' },
  ],
  client_transfer: [
    { name: 'toClientId', label: 'Получатель', kind: 'select', optionsFrom: 'clients', required: true },
    { name: 'currency', label: 'Валюта', kind: 'select', optionsFrom: 'transferCurrencies', defaultValue: 'RUB' },
    { name: 'amount', label: 'Сумма', kind: 'number', suffix: 'currency', required: true },
  ],
  conversion: [
    { name: 'fromCurrency', label: 'Получаем, валюта', kind: 'select', optionsFrom: 'exchangeCurrencies', defaultValue: 'USD' },
    { name: 'quantity', label: 'Получаем', kind: 'number', suffix: 'fromCurrency', required: true },
    { name: 'toCurrency', label: 'Отдаём, валюта', kind: 'select', optionsFrom: 'exchangeCurrencies', defaultValue: 'USDT' },
    { name: 'payAmount', label: 'Отдаём', kind: 'number', suffix: 'toCurrency', required: true },
  ],
  yuan: [
    { name: 'amountCny', label: 'Сумма', kind: 'number', suffix: 'CNY', required: true },
    { name: 'rate', label: 'Курс', kind: 'number', suffix: 'RUB', required: true, defaultValue: '12.4' },
  ],
  invoice: [
    { name: 'receivedUsdt', label: 'USDT получили', kind: 'number', suffix: 'USDT', required: true },
    { name: 'paidUsdt', label: 'USDT отдали', kind: 'number', suffix: 'USDT', required: true },
  ],
  profit: [{ name: 'amount', label: 'Прибыль', kind: 'number', suffix: 'RUB', required: true }],
};

/** Варианты выбора полей формы. */
export function fieldOptions(field: FieldConfig, context: NewDealContext): string[] {
  if (field.optionsFrom === 'cities') return context.cities;
  if (field.optionsFrom === 'clients') return context.clients.map((client) => client.id);
  if (field.optionsFrom === 'transferCurrencies') return ['RUB', 'USDT', 'USD', 'USDW', 'EUR', 'EUR500', 'THB'];
  if (field.optionsFrom === 'exchangeCurrencies') return EXCHANGE_CURRENCIES;
  if (field.optionsFrom === 'cashCurrencies') return CASH_CURRENCIES;
  return CURRENCIES;
}

export function defaultValues(type: NewDealType, context: NewDealContext): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of TYPE_FIELDS[type]) {
    if (field.defaultValue !== undefined) {
      values[field.name] = field.defaultValue;
    } else if (field.optionsFrom === 'clients') {
      values[field.name] = '';
    } else if (field.kind === 'select') {
      values[field.name] = fieldOptions(field, context)[0];
    } else {
      values[field.name] = '';
    }
  }
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
      const foreign = num(values, 'quantity');
      const rub = num(values, 'clientAmount');
      return [
        rubRow('receivedRub', 'Получаем', rub),
        { key: 'paidForeign', label: 'Отдаём', text: `${foreign} ${values.currency}`, value: foreign },
        rubRow('rate', 'Курс RUB за 1', foreign > 0 ? rub / foreign : 0),
      ];
    }
    case 'purchase': {
      const foreign = num(values, 'quantity');
      const rub = num(values, 'clientAmount');
      return [
        { key: 'receivedForeign', label: 'Получаем', text: `${foreign} ${values.currency}`, value: foreign },
        rubRow('paidRub', 'Отдаём', rub),
        rubRow('rate', 'Курс RUB за 1', foreign > 0 ? rub / foreign : 0),
      ];
    }
    case 'deposit':
    case 'withdrawal': {
      const amount = num(values, 'amount');
      const currency = values.currency ?? 'RUB';
      return [
        {
          key: 'amount',
          label: type === 'deposit' ? 'К внесению' : 'К выдаче',
          text: `${amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`,
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
    case 'transfer_city': {
      const amount = num(values, 'amount');
      const fee = (amount * num(values, 'feePercent')) / 100;
      return [
        rubRow('amount', 'Сумма', amount),
        rubRow('fee', 'Комиссия', fee),
        rubRow('total', 'К получению', amount - fee),
      ];
    }
    case 'client_transfer': {
      const amount = num(values, 'amount');
      return [{
        key: 'amount', label: 'К переводу',
        text: `${amount.toLocaleString('ru-RU', { maximumFractionDigits: 8 })} ${values.currency ?? 'RUB'}`,
        value: amount,
      }];
    }
    case 'conversion': {
      const quantity = num(values, 'quantity');
      const result = num(values, 'payAmount');
      const from = values.fromCurrency ?? 'USD';
      const to = values.toCurrency ?? 'USDT';
      return [
        { key: 'receive', label: 'Получаем', text: `${quantity.toLocaleString('ru-RU', { maximumFractionDigits: 8 })} ${from}`, value: quantity },
        { key: 'give', label: 'Отдаём', text: `${result.toLocaleString('ru-RU', { maximumFractionDigits: 8 })} ${to}`, value: result },
        { key: 'rate', label: `Курс ${to} за 1 ${from}`, text: (quantity > 0 ? result / quantity : 0).toLocaleString('ru-RU', { maximumFractionDigits: 8 }), value: quantity > 0 ? result / quantity : 0 },
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
      let profit: string;
      try { profit = invoiceProfit(values.receivedUsdt ?? '', values.paidUsdt ?? ''); }
      catch { return []; }
      return [
        { key: 'receivedUsdt', label: 'Получили от партнёра', text: invoiceUsdt(values.receivedUsdt?.replace(',', '.') || '0'), value: num(values, 'receivedUsdt') },
        { key: 'paidUsdt', label: 'Отдали клиенту', text: invoiceUsdt(values.paidUsdt?.replace(',', '.') || '0'), value: num(values, 'paidUsdt') },
        { key: 'profitUsdt', label: profit.startsWith('-') ? 'Убыток' : 'Прибыль', text: invoiceUsdt(profit), value: Number(profit), tone: profit.startsWith('-') ? 'down' : 'up' },
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
  return result as unknown as CreateDealPayload['fields'];
}

/** Имена обязательных полей с невалидным значением */
export function invalidFields(type: NewDealType, values: Record<string, string>): string[] {
  return TYPE_FIELDS[type]
    .filter((field) => field.required && !(num(values, field.name) > 0))
    .map((field) => field.name);
}
