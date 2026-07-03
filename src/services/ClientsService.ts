import type { IClientsService } from './interfaces';
import type { Client } from '@/types/domain';

/** Мок-реализация клиентской базы (карточка, балансы, Telegram-связка) */
export class MockClientsService implements IClientsService {
  async getClients(): Promise<Client[]> {
    return [
      {
        id: 'c1',
        name: 'Алексей С.',
        group: 'VIP',
        telegramChatName: '@alexey_s',
        telegramChatId: '-100 2411 8975',
        balances: [
          { currency: 'RUB', amount: 1_240_000 },
          { currency: 'USDT', amount: 18_420 },
        ],
        profitRub: 486_000,
        dealsCount: 127,
        recentDeals: [
          { id: '#13245', clientName: 'Алексей С.', operation: 'Покупка USDT', direction: 'USDT/RUB', amountRub: 350_000, profitRub: 8_750, completedAt: 'сегодня', outcome: 'completed' },
          { id: '#13236', clientName: 'Алексей С.', operation: 'Покупка USDT', direction: 'USDT/RUB', amountRub: 500_000, profitRub: 12_500, completedAt: '30.05.2024', outcome: 'completed' },
          { id: '#13198', clientName: 'Алексей С.', operation: 'Продажа BTC', direction: 'BTC/RUB', amountRub: 1_100_000, profitRub: 27_500, completedAt: '24.05.2024', outcome: 'completed' },
        ],
      },
      {
        id: 'c2',
        name: 'ООО «Гранит»',
        group: 'VIP',
        telegramChatName: '@granit_ooo',
        telegramChatId: '-100 1988 3341',
        balances: [
          { currency: 'RUB', amount: 6_800_000 },
          { currency: 'USDT', amount: 52_300 },
        ],
        profitRub: 1_240_000,
        dealsCount: 214,
        recentDeals: [
          { id: '#13240', clientName: 'ООО «Гранит»', operation: 'Покупка USDT', direction: 'USDT/RUB', amountRub: 4_800_000, profitRub: 120_000, completedAt: 'сегодня', outcome: 'completed' },
          { id: '#13235', clientName: 'ООО «Гранит»', operation: 'Покупка USDT', direction: 'USDT/RUB', amountRub: 3_200_000, profitRub: 80_000, completedAt: '30.05.2024', outcome: 'completed' },
        ],
      },
      {
        id: 'c3',
        name: 'Мария К.',
        group: 'Постоянный',
        telegramChatName: '@maria_k',
        telegramChatId: '-100 2201 5570',
        balances: [
          { currency: 'RUB', amount: 320_000 },
          { currency: 'BTC', amount: 0.42 },
        ],
        profitRub: 214_000,
        dealsCount: 63,
        recentDeals: [
          { id: '#13244', clientName: 'Мария К.', operation: 'Продажа BTC', direction: 'BTC/RUB', amountRub: 1_250_000, profitRub: 31_250, completedAt: 'сегодня', outcome: 'completed' },
          { id: '#13234', clientName: 'Мария К.', operation: 'Продажа BTC', direction: 'BTC/RUB', amountRub: 870_000, profitRub: 21_750, completedAt: '29.05.2024', outcome: 'completed' },
        ],
      },
      {
        id: 'c4',
        name: 'Сергей П.',
        group: 'Постоянный',
        telegramChatName: '@sergey_p',
        telegramChatId: '-100 2318 0904',
        balances: [{ currency: 'RUB', amount: 145_000 }],
        profitRub: 96_500,
        dealsCount: 38,
        recentDeals: [
          { id: '#13239', clientName: 'Сергей П.', operation: 'Покупка BTC', direction: 'BTC/RUB', amountRub: 920_000, profitRub: 23_000, completedAt: 'сегодня', outcome: 'completed' },
          { id: '#13233', clientName: 'Сергей П.', operation: 'Покупка ETH', direction: 'ETH/RUB', amountRub: 240_000, profitRub: 0, completedAt: '29.05.2024', outcome: 'cancelled' },
        ],
      },
      {
        id: 'c5',
        name: 'Анна Л.',
        group: 'Новый',
        telegramChatName: '@anna_l',
        telegramChatId: '-100 2455 7218',
        balances: [{ currency: 'USDT', amount: 2_140 }],
        profitRub: 41_200,
        dealsCount: 9,
        recentDeals: [
          { id: '#13238', clientName: 'Анна Л.', operation: 'Продажа USDT', direction: 'USDT/RUB', amountRub: 430_000, profitRub: 10_750, completedAt: 'сегодня', outcome: 'completed' },
          { id: '#13232', clientName: 'Анна Л.', operation: 'Продажа USDT', direction: 'USDT/RUB', amountRub: 1_150_000, profitRub: 28_750, completedAt: '28.05.2024', outcome: 'completed' },
        ],
      },
    ];
  }
}
