import type { IAccountingService } from './interfaces';
import type { CashDesk, CashTransfer, PnLReport } from '@/types/domain';

/** Мок-реализация бухгалтерии: кассы по городам, перемещения, P&L */
export class MockAccountingService implements IAccountingService {
  async getCashDesks(): Promise<CashDesk[]> {
    return [
      {
        id: 'd1',
        city: 'Москва',
        balances: [
          { currency: 'RUB', amount: 8_200_000 },
          { currency: 'USDT', amount: 45_300 },
          { currency: 'USD', amount: 12_500 },
        ],
      },
      {
        id: 'd2',
        city: 'Санкт-Петербург',
        balances: [
          { currency: 'RUB', amount: 2_650_000 },
          { currency: 'USDT', amount: 18_700 },
        ],
      },
      {
        id: 'd3',
        city: 'Казань',
        balances: [
          { currency: 'RUB', amount: 1_600_000 },
          { currency: 'USDT', amount: 6_200 },
        ],
      },
      {
        id: 'd4',
        city: 'Дубай',
        balances: [
          { currency: 'USD', amount: 34_800 },
          { currency: 'USDT', amount: 61_450 },
        ],
      },
    ];
  }

  async getTransfers(): Promise<CashTransfer[]> {
    return [
      { id: 't1', fromCity: 'Москва', toCity: 'Санкт-Петербург', amount: { currency: 'RUB', amount: 1_500_000 }, date: 'сегодня, 14:20' },
      { id: 't2', fromCity: 'Дубай', toCity: 'Москва', amount: { currency: 'USDT', amount: 25_000 }, date: 'вчера, 18:05', comment: 'Пополнение под заявку #13240' },
      { id: 't3', fromCity: 'Москва', toCity: 'Казань', amount: { currency: 'RUB', amount: 600_000 }, date: '29.05.2024' },
      { id: 't4', fromCity: 'Санкт-Петербург', toCity: 'Москва', amount: { currency: 'USD', amount: 8_000 }, date: '28.05.2024' },
    ];
  }

  async getPnL(): Promise<PnLReport> {
    return {
      periodLabel: '01.05.2024 – 31.05.2024',
      clientIncome: 26_550_000,
      fixedExpenses: 1_200_000,
      variableExpenses: 850_000,
      profit: 24_500_000,
    };
  }
}
