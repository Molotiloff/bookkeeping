import type { IBalancesService } from './interfaces';
import type { BalancesSnapshot } from '@/types/balances';
import { initialsOf } from '@/lib/avatar';

const USDT_RATE = 81.3772271;

const CLIENT_BALANCES = [
  ['Свободные', 1],
  ['Байбит Влада', -11_338],
  ['Bs', -16_309],
  ['UralEx', -467],
  ['Blackuid', 331.9],
  ['Иван Б', -29],
  ['Сергей С', 26_061.4],
  ['Алипей Ви чат долг', -67_569.5],
  ['Александр AMG', -2_338],
  ['Николай', 1_728.5],
  ['Сергей О', 1_424],
  ['Zavilov', -50],
  ['Андрей PE', 36_391],
  ['разфикс блато', -250],
  ['от Влада возрат', -2_035],
  ['2R2', 26],
  ['Igor и К', 66],
  ['BestChange', 304],
  ['Влад', 500],
] as const;

/** Мок-реализация балансов клиентов (только ненулевые остатки) */
export class MockBalancesService implements IBalancesService {
  async getSnapshot(): Promise<BalancesSnapshot> {
    return {
      clients: [
        ...CLIENT_BALANCES.map(([name, balance], index) => ({
          id: `sheet-balance-${index + 1}`,
          name,
          clientNumber: `GS-${String(index + 1).padStart(3, '0')}`,
          currency: 'USDT' as const,
          balance,
          balanceRub: Math.round(balance * USDT_RATE),
          initials: initialsOf(name),
          telegramChatId: `sheet:${name}`,
        })),
      ],
      summaries: [
        { code: 'USDT', label: 'USDT клиент.', value: 18_843.22, changePercent: 0, tone: 'neutral' },
        { code: 'EUR', label: 'EUR клиент.', value: 644, changePercent: 0, tone: 'neutral' },
        { code: 'RUB', label: 'Балансы клиентов', value: -13_157_376, changePercent: 0, tone: 'red' },
        { code: 'ALL', label: 'Все балансы', value: -13_157_376, tone: 'red' },
      ],
    };
  }
}
