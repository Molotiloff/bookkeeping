import type { DealDetails } from '../types/deals';
import type { DealStatus, UserRole } from '../types/domain';

export function canManageDeals(role: UserRole): boolean {
  return ['manager', 'accountant', 'owner', 'admin'].includes(role);
}

export function sourceEditable(details: DealDetails): boolean {
  if (['done', 'canceled'].includes(details.deal.status)) return false;
  if (!['tg_bot', 'crm'].includes(details.source)) return false;
  const payment = details.body?.referrer_spread_payment as { status?: string } | undefined;
  return ['exchange', 'cash'].includes(details.sourceKind ?? '') && payment?.status !== 'paid';
}

export function transferAdjustable(details: DealDetails): boolean {
  return details.sourceKind === 'client_transfer' && details.deal.status === 'done'
    && ['tg_bot', 'crm'].includes(details.source);
}

export function workflowStatuses(details: DealDetails): DealStatus[] {
  // Balance-only exchanges retain new -> written to table -> done.
  // Advanced payment actions are only for deals already in that workflow.
  if (details.sourceKind !== 'exchange' || ['new', 'done', 'canceled'].includes(details.deal.status)) return [];
  return (details.deal.allowedNextStatuses ?? []).filter((status) =>
    ['balance_check', 'awaiting_payment', 'in_delivery'].includes(status),
  );
}

export function positiveDecimal(value: FormDataEntryValue | null): string {
  const text = String(value ?? '').trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,8})?$/.test(text) || !/[1-9]/.test(text)) {
    throw new Error('Укажите положительную сумму, до 8 знаков после запятой');
  }
  return text;
}
