import type { DealStatus } from './domain';

export interface TransferAdjustmentRequest {
  newAmount: string | null;
  expectedAmount: string;
  idempotencyKey: string;
  allowNegative: boolean;
}

export interface DealStatusChangeRequest {
  status: DealStatus;
  expectedOldStatus: DealStatus;
  comment?: string;
  payload?: Record<string, string>;
}

export interface DealSettlement {
  id: number;
  dealId: number;
  expected: string;
  actual: string;
  delta: string;
  status: 'matched' | 'needs_review' | 'resolved';
  resolution: string | null;
  currency: string | null;
  txHash: string | null;
}

export interface SettlementReviewRequest {
  resolution: 'accept_actual' | 'amend_unposted';
  comment: string;
}

export interface FulfillmentItem {
  id: number;
  dealId: number;
  requestKind: string;
  qty: string;
  sequenceNo: number;
  status: string;
  reorderedBy: number | null;
  reorderedAt: string | null;
}

export interface FulfillmentQueue {
  items: FulfillmentItem[];
  queuedQty: string;
  usdtFact: string | null;
  queueShortageQty: string | null;
  onchainLiquidQty: string | null;
}
