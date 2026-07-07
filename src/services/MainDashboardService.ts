import type { IMainDashboardService } from './interfaces';
import type { MainDashboardData } from '@/types/mainDashboard';
import { formatSignedRub, formatUsd } from '@/lib/format';

/** Мок-реализация главного дашборда: цифры — как в утверждённом референсе */
export class MockMainDashboardService implements IMainDashboardService {
  async getDashboard(): Promise<MainDashboardData> {
    return {
      dateLabel: '06.07.2026',
      weekdayLabel: 'Понедельник',
      cities: ['Екатеринбург', 'Челябинск', 'Москва'],
      topMetrics: [
        { id: 'fact-turnover', title: 'Факт. оборот', value: '43 396 362 ₽', subtitleLabel: 'Оборот', subtitleValue: '43 396 369 ₽', tone: 'blue', icon: 'reports' },
        { id: 'income-today', title: 'Доход сегодня', value: '623 065 ₽', subtitleLabel: 'Оборот за день', subtitleValue: '11 464 530 ₽', tone: 'green', icon: 'trend-up' },
        { id: 'profit-today', title: 'Прибыль сегодня', value: '515 328 ₽', subtitleLabel: 'Рентабельность', subtitleValue: '4,49%', tone: 'green', icon: 'coins' },
        { id: 'expense-today', title: 'Расход сегодня', value: '107 737 ₽', subtitleLabel: 'Доля расходов', subtitleValue: '0,94%', tone: 'red', icon: 'expenses' },
      ],
      dailyIndicators: [
        { id: 'income', label: 'Доход', value: '623 065 ₽', tone: 'green' },
        { id: 'expense', label: 'Расход', value: '107 737 ₽', tone: 'red' },
        { id: 'profit', label: 'Прибыль', value: '515 328 ₽', tone: 'green' },
        { id: 'turnover', label: 'Оборот за день', value: '11 464 530 ₽', tone: 'blue' },
        { id: 'gap', label: 'Разрыв', value: formatSignedRub(-6), tone: 'red' },
      ],
      currencies: [
        { code: 'EUR', label: 'EUR', amount: 56, rate: 88.514, rubValue: 4_957, clientAmount: 644, factAmount: 700, tone: 'blue' },
        { code: 'USDT', label: 'USDT', amount: 9_408, rate: 80.51, rubValue: 757_435, clientAmount: 17_255, factAmount: 26_790, tone: 'green' },
        { code: 'USD_WH', label: 'USD WH', amount: 0, rate: 0, rubValue: 0, clientAmount: 0, factAmount: 0, tone: 'orange' },
        { code: 'USD_BL', label: 'USD BL', amount: 0, rate: 0, rubValue: 0, clientAmount: 0, factAmount: 0, tone: 'purple' },
      ],
      finance: [
        { id: 'total-rub', label: 'Общий RUB', value: '28 978 511 ₽' },
        { id: 'total-balances', label: 'Общий балансы', value: '-14 417 851 ₽', isNegative: true },
        { id: 'fact-rub', label: 'Факт RUB', value: '14 560 660 ₽' },
        { id: 'rub-in-currency', label: 'RUB в валюте', value: '762 392 ₽', percent: '1,76%' },
        { id: 'client-balances', label: 'Балансы клиентов', value: '-9 080 220 ₽', isNegative: true },
        { id: 'skyex-balances', label: 'Балансы SkyEx', value: '-5 337 631 ₽', isNegative: true },
      ],
      citySummaries: [
        {
          id: 'ekb',
          city: 'ЕКБ',
          rows: [
            { label: 'Доход Екб', value: '314 444 ₽', tone: 'green' },
            { label: 'Расход Екб', value: '0 ₽' },
            { label: 'Прибыль Екб', value: '314 444 ₽', tone: 'green' },
          ],
        },
        {
          id: 'chlb',
          city: 'ЧЛБ',
          rows: [
            { label: 'Прибыль Члб', value: '118 342 ₽', tone: 'green' },
            { label: 'Расход Члб', value: '0 ₽' },
            { label: 'Прибыль Члб', value: '118 342 ₽', tone: 'green' },
          ],
        },
        {
          id: 'msk',
          city: 'МСК',
          rows: [
            { label: 'Прибыль Мск', value: '65 068 ₽', tone: 'green' },
            { label: 'Приб. с городов', value: '515 336 ₽', tone: 'green' },
            { label: 'Приб. со сделок', value: '107 728 ₽', tone: 'green' },
            { label: 'Общая', value: '688 132 ₽', tone: 'green' },
          ],
        },
      ],
      systemMetrics: [
        { id: 'yield', title: 'Доходность', value: '0,398%', subtitle: 'За период', tone: 'green' },
        { id: 'month-turnover', title: 'Месячный оборот', value: '156 512 750 ₽', subtitle: 'Текущий месяц', tone: 'blue' },
        { id: 'usdt-rest', title: 'Остаток приб. в USDT', value: formatUsd(128), subtitle: 'Свободный остаток', tone: 'green' },
        { id: 'gap', title: 'Разрыв', value: formatSignedRub(-6), subtitle: 'Текущий разрыв', tone: 'red' },
        { id: 'working-capital', title: 'Оборотка', value: '42 881 041 ₽', subtitle: 'Оборачиваемость', tone: 'purple' },
        { id: 'rub', title: 'RUB', value: '28 216 120 ₽', subtitle: 'Доля от оборота 65,02%', tone: 'blue' },
        { id: 'rub-in-currency', title: 'RUB в валюте', value: '762 392 ₽', subtitle: 'Доля от оборота 1,76%', tone: 'orange' },
      ],
      lastUpdatedLabel: '06.07.2026 12:30',
    };
  }
}
