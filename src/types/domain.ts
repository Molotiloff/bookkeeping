/**
 * Доменные типы CRM SkyEx.
 * Модель повторяет флоу из ТЗ: заявка приходит из Telegram-бота
 * (crm_requests + request_legs), менеджер ведёт её по статусам,
 * при завершении фиксируются прибыль, касса и ссылка Tronscan.
 */

/** Статусы обменной заявки (status_event в backend) */
export type DealStatus =
  | 'fixed' // Фикс с клиентом (курс зафиксирован)
  | 'awaiting_payment' // Ожидание оплаты
  | 'balance_check' // Сверка баланса (баланс Теза с учётом активных заявок)
  | 'completed' // Сделка завершена (данные сделки + ссылка Tronscan)
  | 'insufficient_usdt'; // Недостаточно USDT (плашка «на откуп», вывод в чат заявок)

/** Валютное направление обмена */
export type DealDirection = 'USDT/RUB' | 'BTC/RUB' | 'ETH/RUB' | 'OTHER';

export interface Deal {
  id: string;
  clientName: string;
  /** Покупка/продажа + актив, например «Покупка USDT» */
  operation: string;
  direction: DealDirection;
  amountRub: number;
  status: DealStatus;
  /** Минуты с момента последнего status_event */
  updatedMinutesAgo: number;
  /** Ссылка на транзакцию — появляется при завершении сделки */
  tronscanUrl?: string;
}

export interface KpiStat {
  id: 'cash_balance' | 'city_balance' | 'profit_day' | 'profit_month';
  label: string;
  amountRub: number;
  /** Изменение к прошлому периоду, в процентах */
  changePercent: number;
}

export interface ProfitPoint {
  /** Подпись по оси X, например «1 мая» */
  label: string;
  value: number;
}

export interface DealStructureSlice {
  direction: DealDirection;
  label: string;
  /** Доля от всех сделок, 0–100 */
  percent: number;
}

export interface DealStructure {
  totalDeals: number;
  slices: DealStructureSlice[];
}

export type NotificationKind =
  | 'new_deal'
  | 'insufficient_usdt'
  | 'status_change'
  | 'deal_completed';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  subtitle: string;
  minutesAgo: number;
}

/** Роли из ТЗ: кассир и менеджер не видят статистику и отчёты */
export type UserRole = 'admin' | 'manager' | 'cashier';

export interface CurrentUser {
  name: string;
  role: UserRole;
  roleLabel: string;
  initials: string;
}
