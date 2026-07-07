import type { IBalancesService } from './interfaces';
import type { BalancesSnapshot } from '@/types/balances';

/** Мок-реализация балансов клиентов (только ненулевые остатки) */
export class MockBalancesService implements IBalancesService {
  async getSnapshot(): Promise<BalancesSnapshot> {
    return {
      clients: [
        {
          id: '1',
          name: 'Алексей Смирнов',
          clientNumber: '#13245',
          currency: 'USDT',
          balance: 3_789.45,
          balanceRub: 378_945.0,
          initials: 'АС',
          telegramChatId: '-1001234567890',
        },
        {
          id: '2',
          name: 'Мария Кузнецова',
          clientNumber: '#13246',
          currency: 'USDT',
          balance: 1_250.0,
          balanceRub: 125_012.5,
          initials: 'МК',
          telegramChatId: '-1001234567891',
        },
        {
          id: '3',
          name: 'Дмитрий Волков',
          clientNumber: '#13247',
          currency: 'BTC',
          balance: 0.0456,
          balanceRub: 304_432.1,
          initials: 'ДВ',
          telegramChatId: '-1001234567892',
        },
        {
          id: '4',
          name: 'Олег Лебедев',
          clientNumber: '#13248',
          currency: 'USDT',
          balance: 960.0,
          balanceRub: 95_677.2,
          initials: 'ОЛ',
          telegramChatId: '-1001234567893',
        },
        {
          id: '5',
          name: 'Анна Лазарева',
          clientNumber: '#13249',
          currency: 'ETH',
          balance: 1.55,
          balanceRub: 256_125.9,
          initials: 'АЛ',
          telegramChatId: '-1001234567894',
        },
        {
          id: '6',
          name: 'Иван Петров',
          clientNumber: '#13250',
          currency: 'USDT',
          balance: 200.0,
          balanceRub: 19_900.0,
          initials: 'ИП',
          telegramChatId: '-1001234567895',
        },
        {
          id: '7',
          name: 'Сергей Волынец',
          clientNumber: '#13251',
          currency: 'USDT',
          balance: 120.0,
          balanceRub: 10_810.0,
          initials: 'СВ',
          telegramChatId: '-1001234567896',
        },
      ],
      summaries: [
        { code: 'USDT', label: 'USDT', value: 1_144_680.0, changePercent: 3.2, tone: 'green' },
        { code: 'RUB', label: 'RUB', value: 782_450.0, changePercent: -1.5, tone: 'red' },
        { code: 'BTC', label: 'BTC', value: 2.1354, changePercent: 0.7, tone: 'green' },
        { code: 'ETH', label: 'ETH', value: 18.42, changePercent: 2.1, tone: 'green' },
        { code: 'ALL', label: 'Все валюты', value: 1_929_685.45, tone: 'neutral' },
      ],
    };
  }
}
