import type {
  IAccountingService,
  IAttendanceService,
  IBalancesService,
  IChartDataService,
  IClientsService,
  IDealsService,
  IExpensesService,
  IMainDashboardService,
  ITurnoverService,
  IUserService,
} from './interfaces';
import { MockMainDashboardService } from './MainDashboardService';
import { MockDealsService } from './DealsService';
import { MockChartDataService } from './ChartDataService';
import { MockUserService } from './UserService';
import { MockClientsService } from './ClientsService';
import { MockAccountingService } from './AccountingService';
import { MockAttendanceService } from './AttendanceService';
import { MockBalancesService } from './BalancesService';
import { MockTurnoverService } from './TurnoverService';
import { MockExpensesService } from './ExpensesService';

/**
 * Composition root: единственное место, где выбираются реализации сервисов.
 * При переходе на живой CRM API меняются только эти строки.
 */
export const mainDashboardService: IMainDashboardService = new MockMainDashboardService();
export const dealsService: IDealsService = new MockDealsService();
export const chartDataService: IChartDataService = new MockChartDataService();
export const userService: IUserService = new MockUserService();
export const clientsService: IClientsService = new MockClientsService();
export const accountingService: IAccountingService = new MockAccountingService();
export const attendanceService: IAttendanceService = new MockAttendanceService();
export const balancesService: IBalancesService = new MockBalancesService();
export const turnoverService: ITurnoverService = new MockTurnoverService();
export const expensesService: IExpensesService = new MockExpensesService();
