import type { IStatsService } from './interfaces';
import type { KpiStat } from '@/types/domain';

/** Мок-реализация сводной статистики (Главная: кассы, города, прибыль) */
export class MockStatsService implements IStatsService {
  async getKpiStats(): Promise<KpiStat[]> {
    return [
      { id: 'cash_balance', label: 'Баланс касс', amountRub: 12_450_000, changePercent: 3.2 },
      { id: 'city_balance', label: 'Баланс городов', amountRub: 8_750_000, changePercent: 1.7 },
      { id: 'profit_day', label: 'Прибыль за день', amountRub: 950_000, changePercent: 5.4 },
      { id: 'profit_month', label: 'Прибыль за месяц', amountRub: 24_500_000, changePercent: 12.8 },
    ];
  }
}
