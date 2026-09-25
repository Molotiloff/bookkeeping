'use server';

import { ApiError } from '@/api/httpClient';
import { dealsService } from '@/services';
import type { ClientTransferRequest } from '@/types/newDeal';

export async function createClientTransfer(payload: ClientTransferRequest): Promise<
  | { ok: true; dealId: string }
  | { ok: false; insufficient: boolean; message: string }
> {
  try {
    const created = await dealsService.createClientTransfer(payload);
    return { ok: true, dealId: created.deal.id };
  } catch (error) {
    return {
      ok: false,
      insufficient: error instanceof ApiError && error.status === 409
        && error.message.includes('Недостаточно средств'),
      message: error instanceof Error ? error.message : 'Не удалось провести перевод',
    };
  }
}
