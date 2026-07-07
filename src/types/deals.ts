import type { CurrencyCode, DealStatus } from './domain';

/**
 * Типы страницы «Сделки»: kanban текущих сделок, сводка по статусам
 * и общий реестр с пагинацией.
 */

export type DealType = 'Покупка' | 'Продажа';

export type DealAsset = 'USDT' | 'BTC' | 'ETH';

export interface DealItem {
  id: string;
  /** Полное имя для таблицы, например «Алексей Смирнов» */
  clientName: string;
  /** Короткое имя для kanban-карточки, например «Алексей С.» */
  clientShortName: string;
  dealType: DealType;
  asset: DealAsset;
  amountRub: number;
  city: string;
  status: DealStatus;
  /** Плашка «на откуп» для balance_check, считается backend поверх act-остатка */
  insufficientUsdt?: boolean;
  /** Человекочитаемое время обновления: «2 мин назад», «Сегодня 10:30» */
  updatedLabel: string;
  createdBy: string;
  /** Показывать ли сделку на kanban-доске текущих сделок */
  onKanban: boolean;
}

/** Направление сделки для таблицы и поиска: «USDT → RUB» */
export function dealDirection(deal: DealItem): string {
  return `${deal.asset} → RUB`;
}

/** Подпись операции для kanban-карточки: «Продажа USDT» */
export function dealOperation(deal: DealItem): string {
  return `${deal.dealType} ${deal.asset}`;
}

export interface DealStatusSummary {
  status: DealStatus;
  count: number;
  /** Сумма по статусу; null — сумма не считается (выводится «—») */
  totalRub: number | null;
}

export interface DealsPageData {
  summaries: DealStatusSummary[];
  cities: string[];
  deals: DealItem[];
}

export interface DealLeg {
  id: string;
  direction: 'IN' | 'OUT';
  currency: CurrencyCode;
  amount: number;
  rate?: number;
  status: 'ACTIVE' | 'CANCELED';
}

export interface DealStatusEvent {
  id: string;
  oldStatus: DealStatus | null;
  newStatus: DealStatus;
  actorName: string;
  createdAt: string;
  comment?: string;
}

export interface DealDetails {
  deal: DealItem;
  dealNo: string;
  createdAt: string;
  updatedAt: string;
  source: 'tg_bot' | 'crm' | 'sheets';
  counterpartyName?: string;
  counterpartyPercent?: number;
  profitRub: number;
  comment?: string;
  tronscanUrl?: string;
  legs: DealLeg[];
  statusEvents: DealStatusEvent[];
}
