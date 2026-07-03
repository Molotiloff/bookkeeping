import type { IDealsService } from './interfaces';
import type { Deal } from '@/types/domain';

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
        status: 'awaiting_payment',
        updatedMinutesAgo: 2,
      },
      {
        id: '#13244',
        clientName: 'Мария К.',
        operation: 'Продажа BTC',
        direction: 'BTC/RUB',
        amountRub: 1_250_000,
        status: 'fixed',
        updatedMinutesAgo: 5,
      },
      {
        id: '#13243',
        clientName: 'Дмитрий В.',
        operation: 'Покупка ETH',
        direction: 'ETH/RUB',
        amountRub: 550_000,
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
        status: 'insufficient_usdt',
        updatedMinutesAgo: 21,
      },
      {
        id: '#13241',
        clientName: 'Ольга Т.',
        operation: 'Продажа USDT',
        direction: 'USDT/RUB',
        amountRub: 780_000,
        status: 'balance_check',
        updatedMinutesAgo: 34,
      },
    ];
  }
}
