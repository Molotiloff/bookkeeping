const SCALE = BigInt(100000000);

function units(raw: string): bigint {
  const text = raw.trim().replace(',', '.') || '0';
  if (!/^\d{1,18}(?:\.\d{1,8})?$/.test(text)) throw new Error('Укажите сумму USDT, до 8 знаков после запятой');
  const [whole, fraction = ''] = text.split('.');
  return BigInt(whole) * SCALE + BigInt(fraction.padEnd(8, '0'));
}

export function invoiceProfit(received: string, paid: string): string {
  const difference = units(received) - units(paid);
  const absolute = difference < BigInt(0) ? -difference : difference;
  const fraction = String(absolute % SCALE).padStart(8, '0').replace(/0+$/, '');
  return `${difference < BigInt(0) ? '-' : ''}${absolute / SCALE}${fraction ? `.${fraction}` : ''}`;
}

export function invoiceUsdt(value: string): string {
  const [whole, fraction = ''] = value.split('.');
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')}${fraction ? `,${fraction}` : ''} USDT`;
}
