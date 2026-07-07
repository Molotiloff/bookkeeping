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
    id: 'c-1', clientNumber: '#13245', name: 'Алексей Смирнов',
    telegramUsername: '@alexey_smirnov', telegramChatId: '-1001234567890',
    dealsCount: 24, turnoverRub: 1_250_000, managerName: 'Иван П.',
    registrationDate: '12.03.2024', counterpartyName: 'Алексей Смирнов (КТ)',
    counterpartyPercent: 0.5, comment: 'Постоянный клиент, крупные суммы.',
  },
  { id: 'c-2', clientNumber: '#13246', name: 'Мария Кузнецова', telegramUsername: '@maria_k', telegramChatId: '-1002345678901', dealsCount: 18, turnoverRub: 980_000, managerName: 'Мария К.', registrationDate: '25.03.2024' },
  { id: 'c-3', clientNumber: '#13247', name: 'Дмитрий Волков', telegramUsername: '@dmitry_volkov', telegramChatId: '-1003456789012', dealsCount: 32, turnoverRub: 1_870_000, managerName: 'Дмитрий В.', registrationDate: '02.02.2024', counterpartyName: 'Дмитрий Волков (КТ)', counterpartyPercent: 0.4 },
  { id: 'c-4', clientNumber: '#13248', name: 'Олег Лебедев', telegramUsername: '@oleg_l', telegramChatId: '-1004567890123', dealsCount: 15, turnoverRub: 750_000, managerName: 'Олег Л.', registrationDate: '14.04.2024' },
  { id: 'c-5', clientNumber: '#13249', name: 'Анна Лазарева', telegramUsername: '@anna_l', telegramChatId: '-1005678901234', dealsCount: 12, turnoverRub: 620_000, managerName: 'Анна Л.', registrationDate: '20.04.2024' },
  { id: 'c-6', clientNumber: '#13250', name: 'Иван Петров', telegramUsername: '@ivan_petrov', telegramChatId: '-1006789012345', dealsCount: 28, turnoverRub: 1_420_000, managerName: 'Иван П.', registrationDate: '18.01.2024' },
  { id: 'c-7', clientNumber: '#13251', name: 'Сергей Волынец', telegramUsername: '@sergey_v', telegramChatId: '-1007890123456', dealsCount: 20, turnoverRub: 1_100_000, managerName: 'Сергей В.', registrationDate: '05.03.2024' },
  { id: 'c-8', clientNumber: '#13252', name: 'Егор Пахомов', telegramUsername: '@egor_p', telegramChatId: '-1008901234567', dealsCount: 8, turnoverRub: 410_000, managerName: 'Мария К.', registrationDate: '28.04.2024' },
  { id: 'c-9', clientNumber: '#13253', name: 'Наталья Ковалева', telegramUsername: '@natalia_k', telegramChatId: '-1009012345678', dealsCount: 6, turnoverRub: 320_000, managerName: 'Олег Л.', registrationDate: '03.05.2024' },
  { id: 'c-10', clientNumber: '#13254', name: 'Владислав Соколов', telegramUsername: '@vlad_sokolov', telegramChatId: '-1000123456789', dealsCount: 5, turnoverRub: 280_000, managerName: 'Дмитрий В.', registrationDate: '10.05.2024' },
];

/** Мок-реализация клиентской базы */
export class MockClientsService implements IClientsService {
  async getClientsPage(): Promise<ClientsPageData> {
    const first = makeClient(SEEDS[0], 0);
    // Комментарии первого клиента — как в утверждённом референсе
    first.comments = [
      { id: 'cm-c-1-1', date: '02.05.2024', author: 'Иван Петров', text: 'Постоянный клиент, крупные суммы.' },
      { id: 'cm-c-1-2', date: '15.04.2024', author: 'Мария Кузнецова', text: 'Часто работает через Telegram.' },
      { id: 'cm-c-1-3', date: '01.04.2024', author: 'Иван Петров', text: 'Проверить лимиты перед крупной сделкой.' },
    ];

    return {
      metrics: [
        { id: 'total', title: 'Всего клиентов', value: '1 248', changePercent: 12.5, subtitle: 'к апрелю', tone: 'purple', icon: 'clients' },
        { id: 'active', title: 'Активных клиентов', value: 842, changePercent: 8.3, subtitle: 'к апрелю', tone: 'green', icon: 'check-circle' },
        { id: 'new', title: 'Новых клиентов', value: 156, changePercent: 15.2, subtitle: 'к апрелю', tone: 'blue', icon: 'plus' },
        { id: 'deals', title: 'Сделок всего', value: '3 682', changePercent: 10.7, subtitle: 'к апрелю', tone: 'orange', icon: 'deals' },
        { id: 'turnover', title: 'Оборот клиентов', value: '15 420 000 ₽', changePercent: 11.4, subtitle: 'к апрелю', tone: 'purple', icon: 'coins' },
      ],
      clients: [first, ...SEEDS.slice(1).map((seed, i) => makeClient(seed, i + 1))],
      totalClients: 1248,
    };
  }
}
