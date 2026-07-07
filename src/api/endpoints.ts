type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

function withQuery(path: string, params?: QueryParams): string {
  if (!params) return path;

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => {
      if (item !== null && item !== undefined && item !== '') {
        query.append(key, String(item));
      }
    });
  });

  const serialized = query.toString();
  return serialized ? `${path}?${serialized}` : path;
}

export const crmApi = {
  auth: {
    telegram: '/auth/telegram',
    me: '/me',
  },
  dashboard: {
    root: '/dashboard',
    rates: '/dashboard/rates',
  },
  deals: {
    list: (params?: QueryParams) => withQuery('/deals', params),
    create: '/deals',
    schema: '/deals/schema',
    byId: (id: string | number) => `/deals/${id}`,
    status: (id: string | number) => `/deals/${id}/status`,
  },
  clients: {
    list: (params?: QueryParams) => withQuery('/clients', params),
    create: '/clients',
    byId: (id: string | number) => `/clients/${id}`,
    comments: (id: string | number) => `/clients/${id}/comments`,
    deleteComment: (commentId: string | number) => `/comments/${commentId}`,
  },
  balances: {
    list: (params?: QueryParams) => withQuery('/balances', params),
  },
  expenses: {
    list: (params?: QueryParams) => withQuery('/expenses', params),
    byId: (id: string | number) => `/expenses/${id}`,
    summary: (params?: QueryParams) => withQuery('/expenses/summary', params),
  },
  accounting: {
    desks: '/accounting/desks',
    moves: '/accounting/moves',
    positions: '/accounting/positions',
    internal: '/accounting/internal',
    reconciliation: '/accounting/reconciliation',
    pnl: (params?: QueryParams) => withQuery('/accounting/pnl', params),
    statistics: (params?: QueryParams) => withQuery('/accounting/statistics', params),
    counterparties: '/accounting/counterparties',
    reportPdf: '/accounting/report.pdf',
  },
  turnover: {
    root: '/turnover',
  },
  attendance: {
    month: (params?: QueryParams) => withQuery('/attendance', params),
  },
  admin: {
    users: '/admin/users',
    counterparties: '/admin/counterparties',
  },
} as const;

export const crmWs = {
  deals: '/ws/deals',
} as const;
