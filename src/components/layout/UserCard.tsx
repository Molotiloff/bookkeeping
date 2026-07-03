import type { CurrentUser } from '@/types/domain';
import { Icon } from '@/components/ui/Icon';
import styles from './UserCard.module.css';

export function UserCard({ user }: { user: CurrentUser }) {
  return (
    <button type="button" className={styles.card} aria-label="Профиль пользователя">
      <span className={styles.avatar} aria-hidden="true">
        {user.initials}
      </span>
      <span className={styles.info}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.role}>{user.roleLabel}</span>
      </span>
      <Icon name="chevron-right" size={15} className={styles.chevron} />
    </button>
  );
}
