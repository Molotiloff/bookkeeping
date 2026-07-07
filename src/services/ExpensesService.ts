import type { IExpensesService } from './interfaces';
import type { ExpensesPageData } from '@/types/expenses';

/** Мок-реализация расходов: структура и строки — из таблицы Google Sheets */
export class MockExpensesService implements IExpensesService {
  async getExpensesPage(): Promise<ExpensesPageData> {
    return {
      periodLabel: '01.06.2026 - 30.06.2026',
      cities: ['Екатеринбург', 'Челябинск', 'Тюмень', 'Москва'],
      metrics: [
        { id: 'total', title: 'Всего расходов', value: 125_350, tone: 'blue', icon: 'wallet' },
        { id: 'fixed', title: 'Постоянные расходы', value: 85_100, tone: 'orange', icon: 'building' },
        { id: 'variable', title: 'Переменные расходы', value: 40_250, tone: 'green', icon: 'trend-up' },
        { id: 'operational', title: 'Операционные расходы', value: 68_200, tone: 'purple', icon: 'settings' },
        { id: 'other', title: 'Прочие расходы', value: 17_150, tone: 'gray', icon: 'file-text' },
      ],
      fixedExpenses: [
        { id: 'fe-1', category: 'Аренда', amount: 30_000, date: '02.06.2026', comment: 'офис в чпб', city: 'Челябинск' },
        { id: 'fe-2', category: 'Бензин', amount: 3_000, date: '02.06.2026', comment: 'Никита', city: 'Екатеринбург' },
        { id: 'fe-3', category: 'Доставка', amount: 1_000, date: '03.06.2026', comment: 'саша чпб', city: 'Челябинск' },
        { id: 'fe-4', category: 'Такси', amount: 425, date: '04.06.2026', comment: 'Лев', city: 'Екатеринбург' },
        { id: 'fe-5', category: 'Инкассация ЧПБ', amount: 3_000, date: '05.06.2026', comment: 'Саша чпб', city: 'Челябинск' },
        { id: 'fe-6', category: 'Интернет', amount: 3_000, date: '05.06.2026', comment: 'Саша чпб', city: 'Челябинск' },
        { id: 'fe-7', category: 'Инкассация ЧЛБ', amount: 3_000, date: '05.06.2026', comment: 'Сергей', city: 'Челябинск' },
        { id: 'fe-8', category: 'Доставка', amount: 3_000, date: '06.06.2026', comment: 'саша чпб', city: 'Челябинск' },
        { id: 'fe-9', category: 'Доставка', amount: 3_500, date: '07.06.2026', comment: 'саша чпб', city: 'Челябинск' },
        { id: 'fe-10', category: 'Доставка', amount: 5_000, date: '08.06.2026', comment: 'инкасс', city: 'Тюмень' },
      ],
      variableExpenses: [
        { id: 've-1', name: 'Пропуска в офис Никита', amount: 2_184, date: '01.06.2026', city: 'Екатеринбург' },
        { id: 've-2', name: 'Пропуск в офис Никита', amount: 504, date: '01.06.2026', city: 'Екатеринбург' },
        { id: 've-3', name: 'продали меньше тезера кп', amount: 2_332, date: '01.06.2026', city: null },
        { id: 've-4', name: 'Прибыль Р екб с Р екб 0,03', amount: 7_980, date: '02.06.2026', city: 'Екатеринбург' },
        { id: 've-5', name: 'За сервера', amount: 1_144, date: '03.06.2026', city: null },
        { id: 've-6', name: 'Др Даниилы', amount: 26_608, date: '08.06.2026', city: null },
        { id: 've-7', name: 'Др Никиты', amount: 30_000, date: '15.06.2026', city: null },
        { id: 've-8', name: 'Флешка', amount: 1_000, date: '24.06.2026', city: null },
        { id: 've-9', name: 'Посидели в кафе Влад', amount: 13_000, date: '29.06.2026', city: null },
        { id: 've-10', name: 'Анита, Сергей', amount: 5_115, date: '29.06.2026', city: 'Екатеринбург' },
        { id: 've-11', name: 'Эстонский номер для Вани', amount: 8_990, date: '30.06.2026', city: null },
      ],
      moreFixedCount: 15,
      moreVariableCount: 8,
      totalCount: 74,
    };
  }
}
