/**
 * Типы формы создания сделки (/deals/new): базовые поля, десять типов
 * операций с собственными наборами полей и итоговый payload.
 */

export type NewDealType =
  | 'sale'
  | 'purchase'
  | 'deposit'
  | 'withdrawal'
  | 'delivery'
  | 'transfer_city'
  | 'conversion'
  | 'yuan'
  | 'invoice'
  | 'profit';

export interface BaseDealForm {
  city: string;
  counterpartyId: string;
  /** Процент КТ, например 0.5 */
  counterpartyPercent: number;
  clientId: string | null;
  comment: string;
}

export interface SaleDealFields {
  currency: string;
  /** Вход (курс компании), RUB за единицу */
  companyRate: number;
  quantity: number;
  /** Выход (клиенту), RUB */
  clientAmount: number;
  /** Ссылка на чек / TxID (Tronscan) */
  txUrl?: string;
}

export type PurchaseDealFields = SaleDealFields;

/** Внесение / выдача наличных */
export interface CashOperationFields {
  currency: string;
  amount: number;
}

export interface DeliveryDealFields {
  amount: number;
  feePercent: number;
}

export interface TransferCityDealFields {
  fromCity: string;
  toCity: string;
  amount: number;
  feePercent: number;
}

export interface ConversionDealFields {
  fromCurrency: string;
  toCurrency: string;
  quantity: number;
  rate: number;
}

export interface YuanDealFields {
  amountCny: number;
  rate: number;
}

export interface InvoiceDealFields {
  amount: number;
  currency: string;
  feePercent: number;
}

export interface ProfitDealFields {
  amount: number;
}

export interface CreateDealPayload {
  base: BaseDealForm;
  type: NewDealType;
  fields:
    | SaleDealFields
    | PurchaseDealFields
    | CashOperationFields
    | DeliveryDealFields
    | TransferCityDealFields
    | ConversionDealFields
    | YuanDealFields
    | InvoiceDealFields
    | ProfitDealFields;
  calculations: Record<string, number>;
}

/** Справочники формы — приходят из сервиса сделок */
export interface NewDealContext {
  cities: string[];
  counterparties: { id: string; name: string }[];
  clients: { id: string; name: string }[];
  /** Курсы компании с главной страницы, RUB за единицу */
  companyRates: Record<string, number>;
  defaultCounterpartyPercent: number;
}
