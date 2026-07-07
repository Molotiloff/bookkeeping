import type { IAttendanceService } from './interfaces';
import type {
  AttendanceDay,
  AttendanceMonth,
  AttendanceStatus,
  Employee,
  SummaryMetric,
} from '@/types/attendance';

/** Дни 1–14 мая 2024 (1 мая — среда); сб/вс подсвечиваются как выходные */
const DAYS: AttendanceDay[] = [
  { day: 1, weekday: 'ср', isWeekend: false },
  { day: 2, weekday: 'чт', isWeekend: false },
  { day: 3, weekday: 'пт', isWeekend: false },
  { day: 4, weekday: 'сб', isWeekend: true },
  { day: 5, weekday: 'вс', isWeekend: true },
  { day: 6, weekday: 'пн', isWeekend: false },
  { day: 7, weekday: 'вт', isWeekend: false },
  { day: 8, weekday: 'ср', isWeekend: false },
  { day: 9, weekday: 'чт', isWeekend: false },
  { day: 10, weekday: 'пт', isWeekend: false },
  { day: 11, weekday: 'сб', isWeekend: true },
  { day: 12, weekday: 'вс', isWeekend: true },
  { day: 13, weekday: 'пн', isWeekend: false },
  { day: 14, weekday: 'вт', isWeekend: false },
];

/** Заполняет диапазон дней одним статусом (дни без записи = нет данных) */
function fill(
  from: number,
  to: number,
  status: AttendanceStatus,
  overrides: Record<number, AttendanceStatus> = {},
): Record<number, AttendanceStatus> {
  const result: Record<number, AttendanceStatus> = {};
  for (let day = from; day <= to; day += 1) {
    result[day] = status;
  }
  return { ...result, ...overrides };
}

/** Мок-реализация календаря посещаемости (данные до «текущей» даты — 10 мая) */
export class MockAttendanceService implements IAttendanceService {
  async getMonth(): Promise<AttendanceMonth> {
    const employees: Employee[] = [
      {
        id: 'emp-1',
        name: 'Иван Петров',
        role: 'Менеджер',
        overtimeHours: 12.5,
        attendance: fill(1, 10, 'present'),
      },
      {
        id: 'emp-2',
        name: 'Мария Кузнецова',
        role: 'Менеджер',
        overtimeHours: 8.0,
        attendance: fill(1, 10, 'present', { 6: 'overtime' }),
      },
      {
        id: 'emp-3',
        name: 'Дмитрий Волков',
        role: 'Оператор',
        overtimeHours: 3.5,
        attendance: fill(1, 10, 'present', {
          3: 'overtime',
          4: 'day_off',
          5: 'overtime',
          9: 'absent',
        }),
      },
      {
        id: 'emp-4',
        name: 'Олег Лебедев',
        role: 'Кассир',
        overtimeHours: 7.0,
        attendance: fill(1, 10, 'present', {
          7: 'overtime',
          8: 'overtime',
          9: 'absent',
          10: 'vacation',
        }),
      },
      {
        id: 'emp-5',
        name: 'Анна Лазарева',
        role: 'Менеджер',
        overtimeHours: 6.0,
        attendance: fill(1, 10, 'present', { 9: 'absent', 10: 'overtime' }),
      },
      {
        id: 'emp-6',
        name: 'Сергей Волынец',
        role: 'Оператор',
        overtimeHours: null,
        attendance: fill(1, 6, 'present', {
          7: 'day_off',
          8: 'day_off',
          9: 'day_off',
          10: 'day_off',
        }),
      },
    ];

    const summary: SummaryMetric[] = [
      {
        id: 'total',
        title: 'Всего сотрудников',
        value: employees.length,
        subtitle: 'Активных сотрудников',
        icon: 'clients',
        tone: 'blue',
      },
      {
        id: 'present',
        title: 'Присутствовали',
        value: 18,
        subtitle: 'дней',
        icon: 'check-circle',
        tone: 'green',
      },
      {
        id: 'overtime',
        title: 'Переработки',
        value: '42.5',
        subtitle: 'часов',
        icon: 'clock',
        tone: 'orange',
      },
      {
        id: 'absent',
        title: 'Отсутствовали',
        value: 4,
        subtitle: 'дня',
        icon: 'x-circle',
        tone: 'red',
      },
    ];

    return { monthLabel: 'Май 2024', days: DAYS, employees, summary };
  }
}
