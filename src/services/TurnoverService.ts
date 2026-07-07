import type { ITurnoverService } from './interfaces';
import type { TurnoverDailyPoint, TurnoverPageData } from '@/types/turnover';

/** Детерминированная «дневная» динамика за май: оборот = покупка + продажа */
function generateDaily(): TurnoverDailyPoint[] {
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const wave = Math.sin(i / 4.2) * 0.22 + Math.sin(i / 1.9) * 0.1;
    const purchase = Math.round((0.55 + wave * 0.6 + (i % 5) * 0.02) * 1_000_000);
    const sale = Math.round((0.38 + wave * 0.35 + ((i + 2) % 4) * 0.015) * 1_000_000);
    return {
      label: `${day} мая`,
      turnover: purchase + sale,
      purchase,
      sale,
    };
  });
}

/** Мок-реализация аналитики оборота компании */
export class MockTurnoverService implements ITurnoverService {
  async getTurnover(): Promise<TurnoverPageData> {
    return {
      periodLabel: '01.05.2024 - 31.05.2024',
      cities: ['Екатеринбург', 'Москва', 'Санкт-Петербург', 'Казань'],
      metrics: [
        { id: 'turnover', label: 'Сумма оборота', valueText: '12 450 000 ₽', changePercent: 12.5, changeNote: 'к апрелю', icon: 'coins', tone: 'purple' },
        { id: 'purchase', label: 'Сумма покупки', valueText: '7 250 000 ₽', changePercent: 9.1, changeNote: 'к апрелю', icon: 'wallet', tone: 'blue' },
        { id: 'sale', label: 'Сумма продажи', valueText: '5 200 000 ₽', changePercent: 15.3, changeNote: 'к апрелю', icon: 'trend-up', tone: 'green' },
        { id: 'profit', label: 'Прибыль', valueText: '1 950 000 ₽', changePercent: 18.6, changeNote: 'к апрелю', icon: 'income', tone: 'orange' },
        { id: 'spread', label: 'Средний спред', valueText: '1.25%', changePercent: 0.15, changeNote: 'к апрелю', icon: 'percent', tone: 'green' },
        { id: 'deals', label: 'Сделок всего', valueText: '342', changePercent: 8.4, changeNote: 'к апрелю', icon: 'deals', tone: 'blue' },
      ],
      daily: generateDaily(),
      structure: {
        totalRub: 12_450_000,
        slices: [
          { id: 'purchase', label: 'Покупка', percent: 58, amountRub: 7_250_000 },
          { id: 'sale', label: 'Продажа', percent: 42, amountRub: 5_200_000 },
        ],
      },
      cityRows: [
        { city: 'Екатеринбург', turnover: 8_250_000, purchase: 4_800_000, sale: 3_450_000, profit: 1_350_000, changePercent: 13.2 },
        { city: 'Москва', turnover: 2_450_000, purchase: 1_450_000, sale: 1_000_000, profit: 450_000, changePercent: 9.7 },
        { city: 'Санкт-Петербург', turnover: 1_250_000, purchase: 750_000, sale: 500_000, profit: 250_000, changePercent: 11.4 },
        { city: 'Казань', turnover: 500_000, purchase: 250_000, sale: 200_000, profit: 50_000, changePercent: 6.3 },
      ],
      currencyRows: [
        { currency: 'USDT', turnover: 7_450_000, sharePercent: 59.8 },
        { currency: 'RUB', turnover: 3_250_000, sharePercent: 26.1 },
        { currency: 'BTC', turnover: 1_250_000, sharePercent: 10.0 },
        { currency: 'ETH', turnover: 500_000, sharePercent: 4.0 },
      ],
      ownerShares: [
        { ownerId: 'o-1', ownerName: 'Иван Петров', percent: 35, amount: 4_357_500 },
        { ownerId: 'o-2', ownerName: 'Мария Кузнецова', percent: 25, amount: 3_112_500 },
        { ownerId: 'o-3', ownerName: 'Дмитрий Волков', percent: 20, amount: 2_490_000 },
        { ownerId: 'o-4', ownerName: 'Олег Лебедев', percent: 20, amount: 2_490_000 },
      ],
      ownerInvestments: [
        { ownerId: 'o-1', ownerName: 'Иван Петров', invested: 4_357_500, currentTurnover: 5_700_000, profit: 852_500, payoutPercent: 35 },
        { ownerId: 'o-2', ownerName: 'Мария Кузнецова', invested: 3_112_500, currentTurnover: 3_785_000, profit: 672_500, payoutPercent: 25 },
        { ownerId: 'o-3', ownerName: 'Дмитрий Волков', invested: 2_490_000, currentTurnover: 2_985_000, profit: 400_000, payoutPercent: 20 },
        { ownerId: 'o-4', ownerName: 'Олег Лебедев', invested: 2_490_000, currentTurnover: 2_470_000, profit: -100_000, payoutPercent: 20 },
      ],
      ownerTransactions: [
        { id: 'ot-1', date: '02.05.2024', type: 'Вклад', ownerName: 'Иван Петров', amount: 500_000, comment: 'Дополнительный вклад' },
        { id: 'ot-2', date: '30.04.2024', type: 'Вывод', ownerName: 'Мария Кузнецова', amount: 200_000, comment: 'Частичный вывод' },
        { id: 'ot-3', date: '28.04.2024', type: 'Вклад', ownerName: 'Дмитрий Волков', amount: 300_000, comment: 'Вклад' },
      ],
      recentDeals: [
        { id: '#13245', clientName: 'Алексей Смирнов', type: 'Продажа', direction: 'USDT → RUB', amountRub: 350_000, time: '2 мин назад' },
        { id: '#13244', clientName: 'Мария Кузнецова', type: 'Продажа', direction: 'BTC → RUB', amountRub: 1_250_000, time: '5 мин назад' },
        { id: '#13247', clientName: 'Дмитрий Волков', type: 'Покупка', direction: 'USDT → RUB', amountRub: 950_000, time: '10 мин назад' },
        { id: '#13243', clientName: 'Дмитрий Волков', type: 'Продажа', direction: 'ETH → RUB', amountRub: 550_000, time: '15 мин назад' },
        { id: '#13250', clientName: 'Олег Лебедев', type: 'Покупка', direction: 'USDT → RUB', amountRub: 270_000, time: '20 мин назад' },
      ],
      periodSummary: {
        maxTurnover: { value: 1_550_000, date: '22 мая' },
        minTurnover: { value: 320_000, date: '7 мая' },
        maxProfit: { value: 280_000, date: '24 мая' },
        averageDailyProfit: 62_903,
        averageCheck: 36_403,
      },
    };
  }
}
