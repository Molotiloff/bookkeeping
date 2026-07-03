import type { IChartDataService } from './interfaces';
import type { DealStructure, ProfitPoint } from '@/types/domain';

/** Мок-реализация данных аналитики за период 01.05–31.05 */
export class MockChartDataService implements IChartDataService {
  async getProfitDynamics(): Promise<ProfitPoint[]> {
    const values = [
      420, 510, 470, 620, 580, 700, 660, 750, 690, 830,
      780, 900, 860, 940, 880, 1010, 960, 1100, 1040, 1180,
      1120, 1230, 1160, 1300, 1260, 1380, 1330, 1450, 1400, 1520, 1490,
    ];
    return values.map((value, i) => ({
      label: `${i + 1} мая`,
      value: value * 1000,
    }));
  }

  async getDealStructure(): Promise<DealStructure> {
    return {
      totalDeals: 1324,
      slices: [
        { direction: 'USDT/RUB', label: 'USDT / RUB', percent: 45 },
        { direction: 'BTC/RUB', label: 'BTC / RUB', percent: 25 },
        { direction: 'ETH/RUB', label: 'ETH / RUB', percent: 20 },
        { direction: 'OTHER', label: 'Другие', percent: 10 },
      ],
    };
  }
}
