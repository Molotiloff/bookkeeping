import type { CurrencyCode as DomainCurrencyCode } from './domain';

/**
 * Типы раздела «Балансы»: клиенты с ненулевыми остатками,
 * сводка по валютам и параметры сортировки таблицы.
 */

/** Значение фильтра валют: конкретная валюта или все сразу */
export type CurrencyFilterValue = CurrencyCode | 'ALL';

export interface BalanceClient {
  id: string;
  name: string;
  clientNumber: string;
  currency: CurrencyCode;
  balance: number;
  balanceRub: number;
  initials: string;
  avatarColor?: string;
  chatUrl?: string;
  telegramChatId?: string;
}

export interface CurrencySummary {
  code: CurrencyCode | 'ALL';
  label: string;
  value: number;
  changePercent?: number;
  tone: 'green' | 'red' | 'neutral';
}

export type BalanceSortKey = 'name' | 'balance' | 'balanceRub';

export type SortDirection = 'asc' | 'desc';

/** Снимок раздела — единица ответа сервиса */
export interface BalancesSnapshot {
  clients: BalanceClient[];
  summaries: CurrencySummary[];
}
export type CurrencyCode = DomainCurrencyCode;
