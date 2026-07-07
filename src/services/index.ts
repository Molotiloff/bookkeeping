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
import { getApiRuntimeConfig } from '@/api/config';
import { ApiClient } from '@/api/httpClient';
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
import {
  ApiAccountingService,
  ApiAttendanceService,
  ApiBalancesService,
  ApiChartDataService,
  ApiClientsService,
  ApiDealsService,
  ApiExpensesService,
  ApiMainDashboardService,
  ApiTurnoverService,
  ApiUserService,
} from './api/ApiServices';

/**
 * Composition root: единственное место, где выбираются реализации сервисов.
 *
 * По умолчанию фронт работает на mock-данных. Реальный CRM API включается
 * явно через env:
 * - CRM_API_BASE_URL=http://localhost:8000/api/v1
 * - CRM_USE_API=true
 *
 * Для браузерных сценариев позже можно использовать NEXT_PUBLIC_CRM_API_BASE_URL
 * и auth-сессию вместо server-only CRM_API_TOKEN.
 */

const config = getApiRuntimeConfig();
const api = config.useMocks
  ? null
  : new ApiClient({
      baseUrl: config.baseUrl,
      getHeaders: async () => {
        const { cookies } = await import('next/headers');
        const cookieHeader = (await cookies()).toString();
        return cookieHeader ? { Cookie: cookieHeader } : null;
      },
      getToken: () => process.env.CRM_API_TOKEN ?? null,
    });

export const mainDashboardService: IMainDashboardService = api
  ? new ApiMainDashboardService(api)
  : new MockMainDashboardService();
export const dealsService: IDealsService = api ? new ApiDealsService(api) : new MockDealsService();
export const chartDataService: IChartDataService = api
  ? new ApiChartDataService(api)
  : new MockChartDataService();
export const userService: IUserService = api ? new ApiUserService(api) : new MockUserService();
export const clientsService: IClientsService = api
  ? new ApiClientsService(api)
  : new MockClientsService();
export const accountingService: IAccountingService = api
  ? new ApiAccountingService(api)
  : new MockAccountingService();
export const attendanceService: IAttendanceService = api
  ? new ApiAttendanceService(api)
  : new MockAttendanceService();
export const balancesService: IBalancesService = api
  ? new ApiBalancesService(api)
  : new MockBalancesService();
export const turnoverService: ITurnoverService = api
  ? new ApiTurnoverService(api)
  : new MockTurnoverService();
export const expensesService: IExpensesService = api
  ? new ApiExpensesService(api)
  : new MockExpensesService();
