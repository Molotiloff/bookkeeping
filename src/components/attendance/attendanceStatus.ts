import type { IconName } from '@/components/ui/Icon';
import type { AttendanceStatus } from '@/types/attendance';

/** Визуальная мета статусов: иконка, подпись и CSS-модификатор ячейки/легенды */
export const ATTENDANCE_STATUS_META: Record<
  AttendanceStatus,
  { icon: IconName; label: string; modifier: string }
> = {
  present: { icon: 'check-circle', label: 'Присутствовал', modifier: 'present' },
  overtime: { icon: 'clock', label: 'Переработка', modifier: 'overtime' },
  absent: { icon: 'x-circle', label: 'Отсутствовал', modifier: 'absent' },
  day_off: { icon: 'clock', label: 'Выходной', modifier: 'dayOff' },
  vacation: { icon: 'plane', label: 'Отпуск', modifier: 'vacation' },
};

export const ATTENDANCE_STATUS_ORDER: AttendanceStatus[] = [
  'present',
  'overtime',
  'absent',
  'day_off',
  'vacation',
];
