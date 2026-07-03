/** Форматирование чисел и времени для интерфейса */

const rubFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
});

export function formatRub(amount: number): string {
  return `${rubFormatter.format(amount)} ₽`;
}

/** Компактный формат для KPI: 12,45 млн ₽ / 950 тыс. ₽ */
export function formatRubCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} млн ₽`;
  }
  if (Math.abs(amount) >= 1_000) {
    const thousands = amount / 1_000;
    return `${thousands.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} тыс. ₽`;
  }
  return formatRub(amount);
}

export function formatPercentChange(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('ru-RU', { maximumFractionDigits: 1 })}%`;
}

export function formatMinutesAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ч назад`;
}
