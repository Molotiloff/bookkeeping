import assert from 'node:assert/strict';
import test from 'node:test';
import { canManageDeals, positiveDecimal, sourceEditable, transferAdjustable, workflowStatuses } from '../src/lib/dealManagement.ts';

const details = (sourceKind = 'exchange', status = 'new', source = 'crm') => ({
  source, sourceKind, body: {}, deal: { status, allowedNextStatuses: ['fixed', 'balance_check', 'awaiting_payment', 'done', 'canceled'] },
});

test('manager UI permissions match current API levels; cashier is read-only', () => {
  for (const role of ['manager', 'accountant', 'owner', 'admin']) assert.equal(canManageDeals(role), true);
  assert.equal(canManageDeals('cashier'), false);
});

test('active exchange/cash can be edited from both transports', () => {
  for (const source of ['crm', 'tg_bot']) for (const kind of ['exchange', 'cash']) {
    assert.equal(sourceEditable(details(kind, 'new', source)), true);
    for (const status of ['done', 'canceled']) assert.equal(sourceEditable(details(kind, status, source)), false);
  }
  assert.equal(sourceEditable(details('best_change')), false);
  assert.equal(sourceEditable(details('exchange', 'new', 'sheets')), false);
  const paid = details(); paid.body.referrer_spread_payment = { status: 'paid' };
  assert.equal(sourceEditable(paid), false);
});

test('transfer correction is a separate audited operation, not generic deal edit', () => {
  assert.equal(transferAdjustable(details('client_transfer', 'done')), true);
  assert.equal(sourceEditable(details('client_transfer', 'done')), false);
  assert.equal(transferAdjustable(details('client_transfer', 'canceled')), false);
  assert.equal(transferAdjustable(details('exchange', 'done')), false);
});

test('short exchange keeps table completion; advanced status buttons never bypass financial completion', () => {
  assert.deepEqual(workflowStatuses(details()), []);
  assert.deepEqual(workflowStatuses(details('cash')), []);
  for (const status of ['done', 'canceled']) assert.deepEqual(workflowStatuses(details('exchange', status)), []);
  assert.deepEqual(workflowStatuses(details('exchange', 'fixed')), ['balance_check', 'awaiting_payment']);
});

test('decimal input is preserved as text and rejects unsafe values', () => {
  assert.equal(positiveDecimal('9007199254740993.01'), '9007199254740993.01');
  assert.equal(positiveDecimal('0,00000001'), '0.00000001');
  for (const input of ['', '0', '-1', 'NaN', 'Infinity', '1e6', '0.000000001', '1;drop table']) {
    assert.throws(() => positiveDecimal(input));
  }
});
