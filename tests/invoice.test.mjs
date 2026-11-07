import assert from 'node:assert/strict';
import test from 'node:test';
import { invoiceProfit, invoiceUsdt } from '../src/lib/invoice.ts';

test('invoice profit is exact USDT difference, including zero and losses', () => {
  assert.equal(invoiceProfit('6000', '5900'), '100');
  assert.equal(invoiceProfit('6000', '6100'), '-100');
  assert.equal(invoiceProfit('0.3', '0.2'), '0.1');
  assert.equal(invoiceProfit('1,00000001', '1'), '0.00000001');
  assert.equal(invoiceProfit('6000', '6000'), '0');
  assert.equal(invoiceProfit('9007199254740993.01', '9007199254740993'), '0.01');
  assert.equal(invoiceUsdt('-1234.567'), '-1\u202f234,567 USDT');
});

test('invalid or overprecise invoice amounts cannot silently round', () => {
  for (const value of ['NaN', 'Infinity', '1e3', '-1', '0.000000001']) assert.throws(() => invoiceProfit(value, '1'));
});
