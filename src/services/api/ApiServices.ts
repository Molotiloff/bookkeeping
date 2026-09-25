import { ApiError, type ApiClient } from '@/api/httpClient';
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
import type { DealDetails, DealSourceEditPayload, DealsPageData } from '@/types/deals';
import type { ExpensesPageData } from '@/types/expenses';
import type {
  ManualCashSnapshot,
  RecordManualCashPayload,
  ReverseManualCashPayload,
} from '@/types/manualCash';
import type { DashboardShadowReport, MainDashboardData } from '@/types/mainDashboard';
import type { ClientTransferRequest, NewDealContext } from '@/types/newDeal';
import type { TurnoverPageData } from '@/types/turnover';
import {
  adaptBalancesSnapshot,
  adaptClient,
  adaptClientsPage,
  adaptDashboard,
  adaptUser,
  type ApiBalancesSnapshot,
  type ApiClientDetails,
  type ApiClientsPage,
  type ApiDashboard,
  type ApiUser,
} from './adapters';

/**
 * API implementations are intentionally thin. During the transition from mocks
 * to FastAPI they preserve the current page DTO contracts, while the backend
 * becomes the source of truth for data and commands.
 */

export class ApiMainDashboardService implements IMainDashboardService {
  constructor(private readonly api: ApiClient) {}

  async getDashboard(): Promise<MainDashboardData> {
    return adaptDashboard(await this.api.get<ApiDashboard>(crmApi.dashboard.root));
  }

  getShadowReport(reportId: number): Promise<DashboardShadowReport> {
    return this.api.get(crmApi.dashboard.shadowReport(reportId));
  }

  getManualCash(): Promise<ManualCashSnapshot> {
    return this.api.get(crmApi.dashboard.manualCash);
  }

  async recordManualCash(payload: RecordManualCashPayload): Promise<void> {
    await this.api.post(crmApi.dashboard.manualCashMoves, payload);
  }

  async reverseManualCash(moveId: number, payload: ReverseManualCashPayload): Promise<void> {
    await this.api.post(crmApi.dashboard.reverseManualCash(moveId), payload);
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

  createClientTransfer(payload: ClientTransferRequest): Promise<DealDetails> {
    return this.api.post(crmApi.deals.clientTransfers, payload);
  }

  editSource(id: string, payload: DealSourceEditPayload): Promise<DealDetails> {
    return this.api.patch(crmApi.deals.source(id), payload);
  }

  cancel(id: string, comment?: string): Promise<DealDetails> {
    return this.api.post(crmApi.deals.cancel(id), { comment: comment || null });
  }
}

export class ApiClientsService implements IClientsService {
  constructor(private readonly api: ApiClient) {}

  async getClientsPage(): Promise<ClientsPageData> {
    const pageSize = 500;
    const firstPage = await this.api.get<ApiClientsPage>(crmApi.clients.list({ limit: pageSize }));
    const clients = [...firstPage.clients];
    for (let offset = pageSize; offset < firstPage.totalClients; offset += pageSize) {
      const page = await this.api.get<ApiClientsPage>(
        crmApi.clients.list({ limit: pageSize, offset }),
      );
      if (page.clients.length === 0) break;
      clients.push(...page.clients);
    }

    const snapshot = adaptClientsPage({
      ...firstPage,
      clients,
      totalClients: clients.length,
    });
    const groups = new Set(snapshot.clients.map((client) => client.comment).filter(Boolean));
    const metricValues: Record<string, number> = {
      total: snapshot.clients.length,
      active: snapshot.clients.filter((client) =>
        client.balances.some((balance) => balance.amount !== 0),
      ).length,
      groups: groups.size,
      transactions: snapshot.clients.reduce((sum, client) => sum + client.dealsCount, 0),
      turnover: Math.round(
        snapshot.clients.reduce((sum, client) => sum + client.turnoverRub, 0),
      ),
    };

    return {
      ...snapshot,
      metrics: snapshot.metrics.map((metric) => ({
        ...metric,
        value: metricValues[metric.id] ?? metric.value,
      })),
    };
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      return adaptClient(await this.api.get<ApiClientDetails>(crmApi.clients.byId(id)));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
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

  async getCurrentUser(): Promise<CurrentUser> {
    return adaptUser(await this.api.get<ApiUser>(crmApi.auth.me));
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

  async getSnapshot(): Promise<BalancesSnapshot> {
    return adaptBalancesSnapshot(
      await this.api.get<ApiBalancesSnapshot>(crmApi.balances.list()),
    );
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
