import type { IDealsService } from './interfaces';
import type { Deal } from '@/types/domain';
import type { DealItem, DealsPageData } from '@/types/deals';
import type { NewDealContext } from '@/types/newDeal';

/** Сделки kanban-доски и первой страницы реестра — как в утверждённом референсе */
const REFERENCE_DEALS: DealItem[] = [
  // Фикс с клиентом
  { id: '#13245', clientName: 'Алексей Смирнов', clientShortName: 'Алексей С.', dealType: 'Продажа', asset: 'USDT', amountRub: 350_000, city: 'Екатеринбург', status: 'fixed', updatedLabel: '2 мин назад', createdBy: 'Иван П.', onKanban: true },
  { id: '#13231', clientName: 'Олег Лебедев', clientShortName: 'Олег Л.', dealType: 'Покупка', asset: 'BTC', amountRub: 780_000, city: 'Екатеринбург', status: 'fixed', updatedLabel: '5 мин назад', createdBy: 'Олег Л.', onKanban: true },
  { id: '#13217', clientName: 'Мария Кузнецова', clientShortName: 'Мария К.', dealType: 'Покупка', asset: 'ETH', amountRub: 450_000, city: 'Екатеринбург', status: 'fixed', updatedLabel: '15 мин назад', createdBy: 'Мария К.', onKanban: true },
  // Ожидание оплаты
  { id: '#13244', clientName: 'Мария Кузнецова', clientShortName: 'Мария К.', dealType: 'Продажа', asset: 'BTC', amountRub: 1_250_000, city: 'Екатеринбург', status: 'awaiting_payment', updatedLabel: '3 мин назад', createdBy: 'Мария К.', onKanban: true },
  { id: '#13230', clientName: 'Иван Петров', clientShortName: 'Иван П.', dealType: 'Покупка', asset: 'USDT', amountRub: 220_000, city: 'Екатеринбург', status: 'awaiting_payment', updatedLabel: '7 мин назад', createdBy: 'Иван П.', onKanban: true },
  { id: '#13218', clientName: 'Сергей Волынец', clientShortName: 'Сергей В.', dealType: 'Продажа', asset: 'USDT', amountRub: 640_000, city: 'Екатеринбург', status: 'awaiting_payment', updatedLabel: '18 мин назад', createdBy: 'Сергей В.', onKanban: true },
  // Сверка баланса
  { id: '#13247', clientName: 'Дмитрий Волков', clientShortName: 'Дмитрий В.', dealType: 'Покупка', asset: 'USDT', amountRub: 950_000, city: 'Екатеринбург', status: 'balance_check', updatedLabel: '10 мин назад', createdBy: 'Дмитрий В.', onKanban: true },
  { id: '#13228', clientName: 'Анна Лазарева', clientShortName: 'Анна Л.', dealType: 'Покупка', asset: 'BTC', amountRub: 330_000, city: 'Екатеринбург', status: 'balance_check', updatedLabel: '20 мин назад', createdBy: 'Анна Л.', onKanban: true },
  { id: '#13201', clientName: 'Алексей Смирнов', clientShortName: 'Алексей С.', dealType: 'Покупка', asset: 'ETH', amountRub: 600_000, city: 'Екатеринбург', status: 'balance_check', updatedLabel: '1 час назад', createdBy: 'Алексей С.', onKanban: true },
  // Сделка завершена
  { id: '#13243', clientName: 'Дмитрий Волков', clientShortName: 'Дмитрий В.', dealType: 'Продажа', asset: 'ETH', amountRub: 550_000, city: 'Екатеринбург', status: 'completed', updatedLabel: 'Сегодня 10:30', createdBy: 'Дмитрий В.', onKanban: true },
  { id: '#13227', clientName: 'Павел Соколов', clientShortName: 'Павел С.', dealType: 'Продажа', asset: 'BTC', amountRub: 120_000, city: 'Екатеринбург', status: 'completed', updatedLabel: 'Сегодня 09:15', createdBy: 'Павел С.', onKanban: true },
  { id: '#13202', clientName: 'Мария Кузнецова', clientShortName: 'Мария К.', dealType: 'Продажа', asset: 'USDT', amountRub: 990_000, city: 'Екатеринбург', status: 'completed', updatedLabel: 'Вчера 18:40', createdBy: 'Мария К.', onKanban: true },
  // Недостаточно USDT
  { id: '#13250', clientName: 'Олег Лебедев', clientShortName: 'Олег Л.', dealType: 'Покупка', asset: 'USDT', amountRub: 270_000, city: 'Екатеринбург', status: 'insufficient_usdt', updatedLabel: 'Сегодня 11:20', createdBy: 'Олег Л.', onKanban: true },
  { id: '#13249', clientName: 'Анна Лазарева', clientShortName: 'Анна Л.', dealType: 'Покупка', asset: 'ETH', amountRub: 210_000, city: 'Екатеринбург', status: 'insufficient_usdt', updatedLabel: 'Сегодня 10:05', createdBy: 'Анна Л.', onKanban: true },
];

/** Детерминированная генерация «хвоста» реестра до 50 сделок */
function generateArchiveDeals(count: number): DealItem[] {
  const clients: [string, string][] = [
    ['Алексей Смирнов', 'Алексей С.'],
    ['Мария Кузнецова', 'Мария К.'],
    ['Дмитрий Волков', 'Дмитрий В.'],
    ['Олег Лебедев', 'Олег Л.'],
    ['Анна Лазарева', 'Анна Л.'],
    ['Сергей Волынец', 'Сергей В.'],
    ['Павел Соколов', 'Павел С.'],
    ['Игорь Новиков', 'Игорь Н.'],
    ['Ольга Титова', 'Ольга Т.'],
  ];
  const cities = ['Екатеринбург', 'Москва', 'Казань', 'Сочи'];
  const assets = ['USDT', 'USDT', 'BTC', 'ETH'] as const;
  const statuses = ['completed', 'completed', 'fixed', 'awaiting_payment', 'balance_check'] as const;
  const updatedLabels = ['Вчера 16:20', 'Вчера 12:05', '29.05.2024', '28.05.2024', '27.05.2024'];
  const managers = ['Иван П.', 'Мария К.', 'Олег Л.', 'Дмитрий В.', 'Сергей В.'];

  return Array.from({ length: count }, (_, i) => {
    const [clientName, clientShortName] = clients[i % clients.length];
    return {
      id: `#${13200 - 1 - i}`,
      clientName,
      clientShortName,
      dealType: i % 2 === 0 ? 'Продажа' : 'Покупка',
      asset: assets[i % assets.length],
      amountRub: ((i * 37) % 90 + 10) * 10_000,
      city: cities[i % cities.length],
      status: statuses[i % statuses.length],
      updatedLabel: updatedLabels[i % updatedLabels.length],
      createdBy: managers[i % managers.length],
      onKanban: false,
    };
  });
}

/** Мок-реализация сделок: компактный список для дашборда + данные страницы «Сделки» */
export class MockDealsService implements IDealsService {
  async getActiveDeals(): Promise<Deal[]> {
    return [
      {
        id: '#13245',
        clientName: 'Алексей С.',
        operation: 'Покупка USDT',
        direction: 'USDT/RUB',
        amountRub: 350_000,
        assetAmount: '3 507 USDT',
        rate: 99.8,
        status: 'awaiting_payment',
        updatedMinutesAgo: 2,
      },
      {
        id: '#13244',
        clientName: 'Мария К.',
        operation: 'Продажа BTC',
        direction: 'BTC/RUB',
        amountRub: 1_250_000,
        assetAmount: '0,214 BTC',
        rate: 5_841_000,
        status: 'fixed',
        updatedMinutesAgo: 5,
      },
      {
        id: '#13243',
        clientName: 'Дмитрий В.',
        operation: 'Покупка ETH',
        direction: 'ETH/RUB',
        amountRub: 550_000,
        assetAmount: '1,74 ETH',
        rate: 316_000,
        status: 'completed',
        updatedMinutesAgo: 15,
        tronscanUrl: 'https://tronscan.org/#/transaction/demo',
      },
      {
        id: '#13242',
        clientName: 'Игорь Н.',
        operation: 'Покупка USDT',
        direction: 'USDT/RUB',
        amountRub: 2_100_000,
        assetAmount: '21 042 USDT',
        rate: 99.8,
        status: 'insufficient_usdt',
        updatedMinutesAgo: 21,
      },
      {
        id: '#13241',
        clientName: 'Ольга Т.',
        operation: 'Продажа USDT',
        direction: 'USDT/RUB',
        amountRub: 780_000,
        assetAmount: '7 795 USDT',
        rate: 100.1,
        status: 'balance_check',
        updatedMinutesAgo: 34,
      },
      {
        id: '#13240',
        clientName: 'ООО «Гранит»',
        operation: 'Покупка USDT',
        direction: 'USDT/RUB',
        amountRub: 4_800_000,
        assetAmount: '48 100 USDT',
        rate: 99.8,
        status: 'fixed',
        updatedMinutesAgo: 48,
      },
      {
        id: '#13239',
        clientName: 'Сергей П.',
        operation: 'Покупка BTC',
        direction: 'BTC/RUB',
        amountRub: 920_000,
        assetAmount: '0,157 BTC',
        rate: 5_860_000,
        status: 'awaiting_payment',
        updatedMinutesAgo: 52,
      },
      {
        id: '#13238',
        clientName: 'Анна Л.',
        operation: 'Продажа USDT',
        direction: 'USDT/RUB',
        amountRub: 430_000,
        assetAmount: '4 295 USDT',
        rate: 100.1,
        status: 'completed',
        updatedMinutesAgo: 73,
        tronscanUrl: 'https://tronscan.org/#/transaction/demo2',
      },
      {
        id: '#13237',
        clientName: 'Виктор Ш.',
        operation: 'Покупка USDT',
        direction: 'USDT/RUB',
        amountRub: 1_640_000,
        assetAmount: '16 430 USDT',
        rate: 99.8,
        status: 'balance_check',
        updatedMinutesAgo: 95,
      },
    ];
  }

  async getDealsPage(): Promise<DealsPageData> {
    const deals = [...REFERENCE_DEALS, ...generateArchiveDeals(50 - REFERENCE_DEALS.length)];

    return {
      summaries: [
        { status: 'fixed', count: 12, totalRub: 1_350_000 },
        { status: 'awaiting_payment', count: 8, totalRub: 980_000 },
        { status: 'balance_check', count: 3, totalRub: 640_000 },
        { status: 'completed', count: 25, totalRub: 4_320_000 },
        { status: 'insufficient_usdt', count: 2, totalRub: null },
      ],
      cities: ['Екатеринбург', 'Москва', 'Казань', 'Сочи'],
      deals,
    };
  }

  async getNewDealContext(): Promise<NewDealContext> {
    return {
      cities: ['Екатеринбург', 'Москва', 'Казань', 'Сочи'],
      counterparties: [
        { id: 'ct-1', name: 'Алексей Смирнов (КТ)' },
        { id: 'ct-2', name: 'Мария Кузнецова (КТ)' },
        { id: 'ct-3', name: 'Павел Соколов (КТ)' },
      ],
      clients: [
        { id: 'c-1', name: 'Алексей Смирнов' },
        { id: 'c-2', name: 'Мария Кузнецова' },
        { id: 'c-3', name: 'Дмитрий Волков' },
        { id: 'c-4', name: 'Олег Лебедев' },
        { id: 'c-5', name: 'Анна Лазарева' },
        { id: 'c-6', name: 'Сергей Волынец' },
      ],
      companyRates: {
        USDT: 90.25,
        BTC: 5_841_000,
        ETH: 316_000,
        CNY: 12.4,
      },
      defaultCounterpartyPercent: 0.5,
    };
  }
}
