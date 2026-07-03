import type { ClientGroup } from '@/types/domain';
import styles from './GroupBadge.module.css';

const GROUP_TONES: Record<ClientGroup, string> = {
  VIP: styles.vip,
  Постоянный: styles.regular,
  Новый: styles.fresh,
};

/** Бейдж группы клиента (группа приходит из Telegram-связки) */
export function GroupBadge({ group }: { group: ClientGroup }) {
  return <span className={`${styles.badge} ${GROUP_TONES[group]}`}>{group}</span>;
}
