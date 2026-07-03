import type { AppNotification, NotificationKind } from '@/types/domain';
import { formatMinutesAgo } from '@/lib/format';
import { Icon, type IconName } from '@/components/ui/Icon';
import styles from './NotificationsPanel.module.css';

/** Визуальная конфигурация типов уведомлений (Open/Closed) */
const KIND_VISUALS: Record<NotificationKind, { icon: IconName; tone: string }> = {
  new_deal: { icon: 'plus', tone: styles.toneInfo },
  insufficient_usdt: { icon: 'alert', tone: styles.toneAlert },
  status_change: { icon: 'deals', tone: styles.toneNeutral },
  deal_completed: { icon: 'check', tone: styles.toneSuccess },
};

export function NotificationsPanel({ notifications }: { notifications: AppNotification[] }) {
  return (
    <div className={styles.list}>
      {notifications.map((notification) => {
        const { icon, tone } = KIND_VISUALS[notification.kind];
        return (
          <article key={notification.id} className={styles.item}>
            <span className={`${styles.iconWrap} ${tone}`}>
              <Icon name={icon} size={15} />
            </span>
            <div className={styles.body}>
              <span className={styles.title}>{notification.title}</span>
              <span className={styles.subtitle}>{notification.subtitle}</span>
            </div>
            <time className={styles.time}>{formatMinutesAgo(notification.minutesAgo)}</time>
          </article>
        );
      })}
      <a href="/notifications" className={styles.allLink}>
        Все уведомления
        <Icon name="chevron-right" size={14} />
      </a>
    </div>
  );
}
