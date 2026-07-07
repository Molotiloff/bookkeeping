import type { IClientsService } from './interfaces';
import type { Client, ClientRecentDeal, ClientsPageData } from '@/types/clients';
import { initialsOf } from '@/lib/avatar';

interface ClientSeed {
  id: string;
  clientNumber: string;
  name: string;
  telegramUsername: string;
  telegramChatId: string;
  dealsCount: number;
  turnoverRub: number;
  managerName: string;
  registrationDate: string;
  counterpartyName?: string;
  counterpartyPercent?: number;
  comment?: string;
}

/** Достраивает карточку клиента: статистика выводится из оборота детерминированно */
function makeClient(seed: ClientSeed, index: number): Client {
  const purchaseVolumeRub = Math.round((seed.turnoverRub * 0.58) / 1000) * 1000;
  const saleVolumeRub = seed.turnoverRub - purchaseVolumeRub;
  const totalProfitRub = Math.round((seed.turnoverRub * 0.144) / 1000) * 1000;
  const averageCheckRub = Math.round(seed.turnoverRub / seed.dealsCount);

  const baseDealId = 13278 - index * 17;
  const recentDeals: ClientRecentDeal[] = [
    { id: `#${baseDealId}`, type: 'Продажа', direction: 'USDT → RUB', amountRub: 350_000, time: '2 мин назад' },
    { id: `#${baseDealId - 7}`, type: 'Покупка', direction: 'BTC → RUB', amountRub: 200_000, time: '1 ч назад' },
    { id: `#${baseDealId - 15}`, type: 'Продажа', direction: 'USDT → RUB', amountRub: 180_000, time: 'Вчера 18:20' },
  ];

  return {
    ...seed,
    initials: initialsOf(seed.name),
    balances: [
      { currency: 'USDT', amount: 3_789.45 - index * 310 },
      { currency: 'BTC', amount: Math.max(0, 0.0125 - index * 0.001) },
      { currency: 'ETH', amount: Math.max(0, 0.35 - index * 0.03) },
      { currency: 'RUB', amount: 0 },
    ],
    totalProfitRub,
    purchaseVolumeRub,
    saleVolumeRub,
    averageCheckRub,
    recentDeals,
    comments: [
      { id: `cm-${seed.id}-1`, date: '02.05.2024', author: 'Иван Петров', text: seed.comment ?? 'Работает через Telegram-чат.' },
    ],
  };
}

const SEEDS: ClientSeed[] = [
  {
    id: 'c-1', clientNumber: 'GS-001', name: 'Gikk',
    telegramUsername: '@sheet_gikk', telegramChatId: 'sheet:Gikk',
    dealsCount: 18, turnoverRub: 7_800_000, managerName: 'Google Sheet',
    registrationDate: '01.06.2026', counterpartyName: 'Gikk',
    counterpartyPercent: 0, comment: 'Продажа USDT: 103 654.485 по выходу 75.25.',
  },
  { id: 'c-2', clientNumber: 'GS-002', name: 'Кит Бокс', telegramUsername: '@sheet_kit_box', telegramChatId: 'sheet:Кит Бокс', dealsCount: 12, turnoverRub: 49_602_500, managerName: 'Google Sheet', registrationDate: '01.06.2026', counterpartyName: 'Алексей М', counterpartyPercent: 0.2 },
  { id: 'c-3', clientNumber: 'GS-003', name: 'Bs', telegramUsername: '@sheet_bs', telegramChatId: 'sheet:Bs', dealsCount: 20, turnoverRub: 18_158_312, managerName: 'Google Sheet', registrationDate: '01.06.2026', counterpartyName: 'Bs', comment: 'Баланс USDT: -16 309.' },
  { id: 'c-4', clientNumber: 'GS-004', name: 'Александр New', telegramUsername: '@sheet_alex_new', telegramChatId: 'sheet:Александр New', dealsCount: 24, turnoverRub: 107_294_656, managerName: 'Google Sheet', registrationDate: '01.06.2026' },
  { id: 'c-5', clientNumber: 'GS-005', name: 'Blato', telegramUsername: '@sheet_blato', telegramChatId: 'sheet:Blato', dealsCount: 8, turnoverRub: 2_390_505, managerName: 'Google Sheet', registrationDate: '01.06.2026', counterpartyName: 'От Вани', counterpartyPercent: 0.3 },
  { id: 'c-6', clientNumber: 'GS-006', name: 'BestChange', telegramUsername: '@sheet_bestchange', telegramChatId: 'sheet:BestChange', dealsCount: 14, turnoverRub: 84_166, managerName: 'Google Sheet', registrationDate: '01.06.2026', counterpartyName: 'DANIYAR', counterpartyPercent: 0.3 },
  { id: 'c-7', clientNumber: 'GS-007', name: 'Андрей PE', telegramUsername: '@sheet_andrey_pe', telegramChatId: 'sheet:Андрей PE', dealsCount: 9, turnoverRub: 280_900, managerName: 'Google Sheet', registrationDate: '01.06.2026', comment: 'Баланс USDT: 36 391.' },
  { id: 'c-8', clientNumber: 'GS-008', name: 'Сергей С', telegramUsername: '@sheet_sergey_s', telegramChatId: 'sheet:Сергей С', dealsCount: 6, turnoverRub: 2_120_000, managerName: 'Google Sheet', registrationDate: '01.06.2026', comment: 'Баланс USDT: 26 061.4.' },
  { id: 'c-9', clientNumber: 'GS-009', name: 'Байбит Влада', telegramUsername: '@sheet_bybit_vlad', telegramChatId: 'sheet:Байбит Влада', dealsCount: 4, turnoverRub: 922_800, managerName: 'Google Sheet', registrationDate: '01.06.2026', comment: 'Баланс USDT: -11 338.' },
  { id: 'c-10', clientNumber: 'GS-010', name: 'Алипей Ви чат долг', telegramUsername: '@sheet_alipay_debt', telegramChatId: 'sheet:Алипей Ви чат долг', dealsCount: 2, turnoverRub: 5_498_000, managerName: 'Google Sheet', registrationDate: '01.06.2026', comment: 'Крупный отрицательный баланс USDT: -67 569.5.' },
];

/** Мок-реализация клиентской базы */
export class MockClientsService implements IClientsService {
  private buildClients(): Client[] {
    const first = makeClient(SEEDS[0], 0);
    // Комментарии первого клиента — как в утверждённом референсе
    first.comments = [
      { id: 'cm-c-1-1', date: '02.05.2024', author: 'Иван Петров', text: 'Постоянный клиент, крупные суммы.' },
      { id: 'cm-c-1-2', date: '15.04.2024', author: 'Мария Кузнецова', text: 'Часто работает через Telegram.' },
      { id: 'cm-c-1-3', date: '01.04.2024', author: 'Иван Петров', text: 'Проверить лимиты перед крупной сделкой.' },
    ];

    return [first, ...SEEDS.slice(1).map((seed, i) => makeClient(seed, i + 1))];
  }

  async getClientsPage(): Promise<ClientsPageData> {
    return {
      metrics: [
        { id: 'total', title: 'Клиентов в срезе', value: 218, changePercent: 0, subtitle: 'лист «Контрагенты»', tone: 'purple', icon: 'clients' },
        { id: 'active', title: 'Клиентов с балансом', value: 19, changePercent: 0, subtitle: 'Главная / USDT', tone: 'green', icon: 'check-circle' },
        { id: 'new', title: 'КТ-связок', value: 7, changePercent: 0, subtitle: 'правая таблица', tone: 'blue', icon: 'plus' },
        { id: 'deals', title: 'Строк продаж', value: '3 949', changePercent: 0, subtitle: 'лист «Продажа»', tone: 'orange', icon: 'deals' },
        { id: 'turnover', title: 'Продажа USDT', value: '641 786 991 ₽', changePercent: 0, subtitle: 'лист «Статиситка»', tone: 'purple', icon: 'coins' },
      ],
      clients: this.buildClients(),
      totalClients: 218,
    };
  }

  async getClientById(id: string): Promise<Client | null> {
    const decodedId = decodeURIComponent(id);
    return this.buildClients().find((client) => client.id === decodedId) ?? null;
  }
}
