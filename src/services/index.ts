import type {
  IChartDataService,
  IDealsService,
  INotificationsService,
  IStatsService,
  IUserService,
} from './interfaces';
import { MockStatsService } from './StatsService';
import { MockDealsService } from './DealsService';
import { MockChartDataService } from './ChartDataService';
import { MockNotificationsService } from './NotificationsService';
import { MockUserService } from './UserService';

/**
 * Composition root: единственное место, где выбираются реализации сервисов.
 * При переходе на живой CRM API меняются только эти строки.
 */
export const statsService: IStatsService = new MockStatsService();
export const dealsService: IDealsService = new MockDealsService();
export const chartDataService: IChartDataService = new MockChartDataService();
export const notificationsService: INotificationsService = new MockNotificationsService();
export const userService: IUserService = new MockUserService();
