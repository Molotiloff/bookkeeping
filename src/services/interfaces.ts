import type {
  AppNotification,
  CurrentUser,
  Deal,
  DealStructure,
  KpiStat,
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
