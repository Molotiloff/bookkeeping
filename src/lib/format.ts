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

import type { MoneyAmount } from '@/types/domain';

/** Форматирование суммы в произвольной валюте: 45 300 USDT, $12 500, 8,2 млн ₽ */
export function formatMoney({ currency, amount }: MoneyAmount): string {
  const formatted = amount.toLocaleString('ru-RU', { maximumFractionDigits: 3 });
  switch (currency) {
    case 'RUB':
      return `${formatted} ₽`;
    case 'USD':
      return `$${formatted}`;
    case 'EUR':
      return `€${formatted}`;
    default:
      return `${formatted} ${currency}`;
  }
}

export function formatMinutesAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ч назад`;
}
