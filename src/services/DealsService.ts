import type { IDealsService } from './interfaces';
import type { Deal, DealHistoryItem } from '@/types/domain';

/** Мок-реализация доски активных сделок (crm_requests + request_legs) */
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

  async getHistory(): Promise<DealHistoryItem[]> {
    return [
      { id: '#13236', clientName: 'Алексей С.', operation: 'Покупка USDT', direction: 'USDT/RUB', amountRub: 500_000, profitRub: 12_500, completedAt: '30.05.2024', outcome: 'completed' },
      { id: '#13235', clientName: 'ООО «Гранит»', operation: 'Покупка USDT', direction: 'USDT/RUB', amountRub: 3_200_000, profitRub: 80_000, completedAt: '30.05.2024', outcome: 'completed' },
      { id: '#13234', clientName: 'Мария К.', operation: 'Продажа BTC', direction: 'BTC/RUB', amountRub: 870_000, profitRub: 21_750, completedAt: '29.05.2024', outcome: 'completed' },
      { id: '#13233', clientName: 'Сергей П.', operation: 'Покупка ETH', direction: 'ETH/RUB', amountRub: 240_000, profitRub: 0, completedAt: '29.05.2024', outcome: 'cancelled' },
      { id: '#13232', clientName: 'Анна Л.', operation: 'Продажа USDT', direction: 'USDT/RUB', amountRub: 1_150_000, profitRub: 28_750, completedAt: '28.05.2024', outcome: 'completed' },
      { id: '#13231', clientName: 'Виктор Ш.', operation: 'Покупка USDT', direction: 'USDT/RUB', amountRub: 690_000, profitRub: 17_250, completedAt: '28.05.2024', outcome: 'completed' },
    ];
  }
}
