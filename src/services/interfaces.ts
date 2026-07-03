import type {
  AppNotification,
  CashDesk,
  CashTransfer,
  Client,
  CurrentUser,
  Deal,
  DealHistoryItem,
  DealStructure,
  KpiStat,
  PnLReport,
  ProfitPoint,
} from '@/types/domain';

/**
 * Контракты слоя данных (Dependency Inversion):
 * страницы и компоненты зависят только от этих интерфейсов.
 * Сейчас реализации отдают мок-данные, при подключении CRM API
 * достаточно заменить реализацию в composition root (services/index.ts).
 */

export interface IStatsService {
  getKpiStats(): Promise<KpiStat[]>;
}

export interface IDealsService {
  getActiveDeals(): Promise<Deal[]>;
  getHistory(): Promise<DealHistoryItem[]>;
}

export interface IClientsService {
  getClients(): Promise<Client[]>;
}

export interface IAccountingService {
  getCashDesks(): Promise<CashDesk[]>;
  getTransfers(): Promise<CashTransfer[]>;
  getPnL(): Promise<PnLReport>;
}

export interface IChartDataService {
  getProfitDynamics(): Promise<ProfitPoint[]>;
  getDealStructure(): Promise<DealStructure>;
}

export interface INotificationsService {
  getRecent(): Promise<AppNotification[]>;
}

export interface IUserService {
  getCurrentUser(): Promise<CurrentUser>;
}
