import type { ApiClient } from '@/api/httpClient';
import { crmApi } from '@/api/endpoints';
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
} from '../interfaces';
import type {
  CashDesk,
  CashTransfer,
  CurrentUser,
  Deal,
  DealStructure,
  PnLReport,
  ProfitPoint,
} from '@/types/domain';
import type { AttendanceMonth } from '@/types/attendance';
import type { BalancesSnapshot } from '@/types/balances';
import type { Client, ClientsPageData } from '@/types/clients';
import type { DealDetails, DealsPageData } from '@/types/deals';
import type { ExpensesPageData } from '@/types/expenses';
import type { MainDashboardData } from '@/types/mainDashboard';
import type { NewDealContext } from '@/types/newDeal';
import type { TurnoverPageData } from '@/types/turnover';

/**
 * API implementations are intentionally thin. During the transition from mocks
 * to FastAPI they preserve the current page DTO contracts, while the backend
 * becomes the source of truth for data and commands.
 */

export class ApiMainDashboardService implements IMainDashboardService {
  constructor(private readonly api: ApiClient) {}

  getDashboard(): Promise<MainDashboardData> {
    return this.api.get(crmApi.dashboard.root);
  }
}

export class ApiDealsService implements IDealsService {
  constructor(private readonly api: ApiClient) {}

  getActiveDeals(): Promise<Deal[]> {
    return this.api.get(crmApi.deals.list({ status: ['new', 'fixed', 'balance_check', 'awaiting_payment', 'in_delivery'] }));
  }

  getDealsPage(): Promise<DealsPageData> {
    return this.api.get(crmApi.deals.list());
  }

  getDealById(id: string): Promise<DealDetails | null> {
    return this.api.get(crmApi.deals.byId(id));
  }

  getNewDealContext(): Promise<NewDealContext> {
    return this.api.get(crmApi.deals.schema);
  }
}

export class ApiClientsService implements IClientsService {
  constructor(private readonly api: ApiClient) {}

  getClientsPage(): Promise<ClientsPageData> {
    return this.api.get(crmApi.clients.list());
  }

  getClientById(id: string): Promise<Client | null> {
    return this.api.get(crmApi.clients.byId(id));
  }
}

export class ApiAccountingService implements IAccountingService {
  constructor(private readonly api: ApiClient) {}

  getCashDesks(): Promise<CashDesk[]> {
    return this.api.get(crmApi.accounting.desks);
  }

  getTransfers(): Promise<CashTransfer[]> {
    return this.api.get(crmApi.accounting.moves);
  }

  getPnL(): Promise<PnLReport> {
    return this.api.get(crmApi.accounting.pnl());
  }
}

export class ApiChartDataService implements IChartDataService {
  constructor(private readonly api: ApiClient) {}

  getProfitDynamics(): Promise<ProfitPoint[]> {
    return this.api.get(crmApi.accounting.statistics({ view: 'profit_dynamics' }));
  }

  getDealStructure(): Promise<DealStructure> {
    return this.api.get(crmApi.accounting.statistics({ view: 'deal_structure' }));
  }
}

export class ApiUserService implements IUserService {
  constructor(private readonly api: ApiClient) {}

  getCurrentUser(): Promise<CurrentUser> {
    return this.api.get(crmApi.auth.me);
  }
}

export class ApiAttendanceService implements IAttendanceService {
  constructor(private readonly api: ApiClient) {}

  getMonth(): Promise<AttendanceMonth> {
    return this.api.get(crmApi.attendance.month());
  }
}

export class ApiBalancesService implements IBalancesService {
  constructor(private readonly api: ApiClient) {}

  getSnapshot(): Promise<BalancesSnapshot> {
    return this.api.get(crmApi.balances.list());
  }
}

export class ApiTurnoverService implements ITurnoverService {
  constructor(private readonly api: ApiClient) {}

  getTurnover(): Promise<TurnoverPageData> {
    return this.api.get(crmApi.turnover.root);
  }
}

export class ApiExpensesService implements IExpensesService {
  constructor(private readonly api: ApiClient) {}

  getExpensesPage(): Promise<ExpensesPageData> {
    return this.api.get(crmApi.expenses.list());
  }
}
