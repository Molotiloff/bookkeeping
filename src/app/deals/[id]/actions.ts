'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/api/httpClient';
import { dealsService } from '@/services';
import type { DealSourceEditPayload } from '@/types/deals';

export interface DealActionState {
  error?: string;
  success?: string;
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
    revalidatePath(`/deals/${dealId}`);
    revalidatePath('/deals');
    return { success: 'Заявка отменена, компенсация проведена' };
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
