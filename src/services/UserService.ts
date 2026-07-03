import type { IUserService } from './interfaces';
import type { CurrentUser } from '@/types/domain';

/** Мок-реализация текущего пользователя (роль ограничивает доступ к отчётам) */
export class MockUserService implements IUserService {
  async getCurrentUser(): Promise<CurrentUser> {
    return {
      name: 'Иван Петров',
      role: 'manager',
      roleLabel: 'Менеджер',
      initials: 'ИП',
    };
  }
}
