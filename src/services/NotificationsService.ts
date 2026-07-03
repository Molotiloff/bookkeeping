import type { INotificationsService } from './interfaces';
import type { AppNotification } from '@/types/domain';

/** Мок-реализация ленты уведомлений (события backend + чат заявок) */
export class MockNotificationsService implements INotificationsService {
  async getRecent(): Promise<AppNotification[]> {
    return [
      {
        id: 'n1',
        kind: 'insufficient_usdt',
        title: 'Недостаточно USDT',
        subtitle: 'Касса · Москва',
        minutesAgo: 1,
      },
      {
        id: 'n2',
        kind: 'new_deal',
        title: 'Новая сделка',
        subtitle: '#13245 · Покупка USDT',
        minutesAgo: 2,
      },
      {
        id: 'n3',
        kind: 'status_change',
        title: 'Смена статуса',
        subtitle: '#13244 · Фикс с клиентом',
        minutesAgo: 5,
      },
      {
        id: 'n4',
        kind: 'deal_completed',
        title: 'Сделка завершена',
        subtitle: '#13243 · Ссылка Tronscan',
        minutesAgo: 15,
      },
    ];
  }
}
