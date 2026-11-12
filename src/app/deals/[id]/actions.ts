'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/api/httpClient';
import { dealsService } from '@/services';
import type { DealSourceEditPayload } from '@/types/deals';
import type { DealStatus } from '@/types/domain';
import type { SettlementReviewRequest, TransferAdjustmentRequest } from '@/types/dealManagement';
import { positiveDecimal } from '@/lib/dealManagement';

export interface DealActionState {
  error?: string;
  success?: string;
  insufficient?: boolean;
}

function refreshDeal(id: string) {
  for (const path of [`/deals/${id}`, '/deals', '/balances', '/clients']) revalidatePath(path);
}

export async function deliveryStatusAction(
  id: string, amount: string, reward: string, courierClientId: number,
  _previous: DealActionState, form: FormData,
): Promise<DealActionState> {
  void _previous;
  try {
    const status = requiredText(form, 'status');
    if (status !== 'in_delivery' && status !== 'done' && status !== 'canceled') throw new Error('Недоступное действие');
    await dealsService.transitionDelivery(id, { status, expectedAmount: amount, expectedRewardRub: reward, expectedCourierClientId: courierClientId });
    refreshDeal(id);
    revalidatePath('/expenses');
    revalidatePath('/');
    return { success: status === 'done' ? 'Доставка завершена. Сумма списана с клиента и кассы, вознаграждение начислено курьеру.' : status === 'canceled' ? 'Доставка отменена без проводок.' : 'Доставка передана курьеру.' };
  } catch (error) { return { error: actionError(error) }; }
}

export async function postInvoiceAction(id: string, received: string, paid: string, _previous: DealActionState, form: FormData): Promise<DealActionState> {
  void _previous;
  try {
    await dealsService.postInvoice(id, { expectedReceivedUsdt: received, expectedPaidUsdt: paid, allowLoss: form.get('allowLoss') === 'on' });
    refreshDeal(id);
    revalidatePath('/');
    return { success: 'Инвойс проведён. Движение кассы и прибыль учтены один раз.' };
  } catch (error) { return { error: actionError(error) }; }
}

export async function cancelInvoiceAction(id: string, _previous: DealActionState, form: FormData): Promise<DealActionState> {
  void _previous;
  try {
    await dealsService.cancelInvoice(id, optionalText(form, 'comment') ?? null);
    refreshDeal(id);
    return { success: 'Новый инвойс отменён без движения денег' };
  } catch (error) { return { error: actionError(error) }; }
}

export async function readyCashAction(id: string, _previous: DealActionState): Promise<DealActionState> {
  void _previous;
  try {
    await dealsService.markCashReady(id);
    refreshDeal(id);
    return { success: 'Заявка готова к расчёту. Проведение — командой из кассового чата.' };
  } catch (error) { return { error: actionError(error) }; }
}

export async function changeStatusAction(
  id: string, expectedOldStatus: DealStatus, _previous: DealActionState, form: FormData,
): Promise<DealActionState> {
  void _previous;
  try {
    const status = requiredText(form, 'status') as DealStatus;
    if (!['balance_check', 'awaiting_payment', 'in_delivery'].includes(status)) throw new Error('Недоступное действие');
    const watch = optionalText(form, 'paymentWatchId');
    await dealsService.changeStatus(id, {
      status, expectedOldStatus, comment: optionalText(form, 'comment'),
      payload: watch ? { paymentWatchId: watch } : {},
    });
    refreshDeal(id);
    return { success: 'Статус обновлён' };
  } catch (error) { return { error: actionError(error) }; }
}

export async function adjustTransferAction(
  id: string, payload: TransferAdjustmentRequest,
): Promise<DealActionState> {
  try {
    if (payload.newAmount !== null) positiveDecimal(payload.newAmount);
    positiveDecimal(payload.expectedAmount);
    await dealsService.adjustTransfer(id, payload);
    refreshDeal(id);
    return { success: payload.newAmount === null ? 'Перевод отменён, балансы пересчитаны' : 'Перевод исправлен, новые чеки отправлены' };
  } catch (error) {
    return {
      error: actionError(error),
      insufficient: error instanceof ApiError && error.status === 409 && error.message.includes('Недостаточно средств'),
    };
  }
}

export async function resolveSettlementAction(
  dealId: string, settlementId: number, _previous: DealActionState, form: FormData,
): Promise<DealActionState> {
  void _previous;
  try {
    const resolution = requiredText(form, 'resolution');
    if (resolution !== 'accept_actual' && resolution !== 'amend_unposted') throw new Error('Недоступное решение');
    const payload: SettlementReviewRequest = { resolution, comment: requiredText(form, 'comment') };
    await dealsService.resolveSettlement(settlementId, payload);
    refreshDeal(dealId);
    return { success: 'Решение сохранено' };
  } catch (error) { return { error: actionError(error) }; }
}

export async function reorderQueueAction(
  itemId: number, beforeItemId: number | null, _previous: DealActionState,
): Promise<DealActionState> {
  void _previous;
  try {
    await dealsService.reorderFulfillment(itemId, beforeItemId);
    revalidatePath('/deals');
    return { success: 'Порядок очереди изменён' };
  } catch (error) { return { error: actionError(error) }; }
}

export async function writeDealToTableAction(
  dealId: string,
  _previous: DealActionState,
): Promise<DealActionState> {
  void _previous;
  try {
    await dealsService.writeToTable(dealId);
    revalidatePath(`/deals/${dealId}`);
    revalidatePath('/deals');
    return { success: 'Заявка занесена в таблицу, сделка завершена' };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function payReferrerSpreadAction(
  dealId: string,
  payload: import('@/types/referrerSpread').ReferrerSpreadPayRequest,
  _previous: DealActionState,
): Promise<DealActionState> {
  void _previous;
  try {
    await dealsService.payReferrerSpread(dealId, payload);
    revalidatePath(`/deals/${dealId}`);
    revalidatePath('/deals');
    revalidatePath('/balances');
    revalidatePath('/clients');
    return { success: 'Спред КТ зачислен на баланс RUB' };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function editDealSourceAction(
  dealId: string,
  _previous: DealActionState,
  formData: FormData,
): Promise<DealActionState> {
  try {
    await dealsService.editSource(dealId, sourcePayload(formData));
    revalidatePath(`/deals/${dealId}`);
    revalidatePath('/deals');
    return { success: 'Заявка обновлена' };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function cancelDealAction(
  dealId: string,
  _previous: DealActionState,
  formData: FormData,
): Promise<DealActionState> {
  try {
    await dealsService.cancel(dealId, optionalText(formData, 'cancelComment'));
    revalidatePath('/balances');
    revalidatePath('/clients');
    revalidatePath(`/deals/${dealId}`);
    revalidatePath('/deals');
    return { success: 'Заявка отменена, очередь и балансы обновлены по правилам операции' };
  } catch (error) {
    return { error: actionError(error) };
  }
}

function sourcePayload(formData: FormData): DealSourceEditPayload {
  if (formData.get('sourceKind') === 'exchange') {
    return {
      exchange: {
        operationId: Date.now(),
        recvCode: requiredText(formData, 'recvCode'),
        recvAmount: positiveNumber(formData, 'recvAmount'),
        payCode: requiredText(formData, 'payCode'),
        payAmount: positiveNumber(formData, 'payAmount'),
        rate: positiveNumber(formData, 'rate'),
        note: optionalText(formData, 'note'),
      },
    };
  }

  const requestKind = requiredText(formData, 'requestKind');
  return {
    cash: {
      city: requiredText(formData, 'city'),
      amount: requestKind === 'fx' ? undefined : positiveNumber(formData, 'amount'),
      inAmount: requestKind === 'fx' ? positiveNumber(formData, 'inAmount') : undefined,
      outAmount: requestKind === 'fx' ? positiveNumber(formData, 'outAmount') : undefined,
      comment: optionalText(formData, 'note'),
      contact1: optionalText(formData, 'contact1'),
      contact2: optionalText(formData, 'contact2'),
    },
  };
}

function requiredText(formData: FormData, name: string): string {
  const value = String(formData.get(name) ?? '').trim();
  if (!value) throw new Error(`Поле «${name}» обязательно`);
  return value;
}

function optionalText(formData: FormData, name: string): string | undefined {
  return String(formData.get(name) ?? '').trim() || undefined;
}

function positiveNumber(formData: FormData, name: string): number {
  const value = Number(requiredText(formData, name).replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0) throw new Error(`Поле «${name}» должно быть больше нуля`);
  return value;
}

function actionError(error: unknown): string {
  if (error instanceof ApiError || error instanceof Error) return error.message;
  return 'Не удалось выполнить операцию';
}
