import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { dealsService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';
import { formatMoney, formatMoneyRub, formatRub } from '@/lib/format';
import { dealDirection, dealOperation } from '@/types/deals';
import { DealSourceActions } from '@/components/deals/DealSourceActions';
import { DealManagementPanel } from '@/components/deals/DealManagementPanel';
import { InvoicePanel } from '@/components/deals/InvoicePanel';
import { canManageDeals } from '@/lib/dealManagement';
import styles from './page.module.css';

export default async function DealDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRouteAccess('/deals');
  const { id } = await params;
  const details = await dealsService.getDealById(id);

  if (!details) {
    notFound();
  }

  const { deal } = details;
  const canManage = canManageDeals(user.role);
  const settlements = canManage && ['exchange', 'fulfillment'].includes(details.sourceKind ?? '')
    ? await dealsService.getSettlements(id) : [];
  const spreadPayment = details.body?.referrer_spread_payment as
    { status?: string; amount_rub?: string } | undefined;
  const cashCurrency = details.sourceKind === 'cash'
    ? String(details.body?.currency ?? deal.asset).toUpperCase()
    : null;
  const requestedCashAmount = cashCurrency ? finiteAmount(details.body?.amount) : null;
  const settledCashAmount = cashCurrency && deal.status === 'done'
    ? finiteAmount(details.body?.settled_qty)
    : null;
  const displayedCashAmount = settledCashAmount ?? requestedCashAmount;

  return (
    <div className={styles.page}>
      <Link href="/deals" className={styles.backLink}>
        ← Все сделки
      </Link>

      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Сделка {details.dealNo}</h1>
          <p className={styles.subtitle}>
            {dealOperation(deal)} · {deal.clientName} · {deal.city}
          </p>
        </div>
        <StatusBadge status={deal.status} />
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Параметры сделки</h2>
          <div className={styles.facts}>
            <div className={styles.fact}>
              <span className={styles.label}>
                {settledCashAmount !== null ? 'Фактически проведено' : 'Сумма'}
              </span>
              <span className={styles.amount}>
                {cashCurrency && displayedCashAmount !== null
                  ? formatCashAmount(displayedCashAmount, cashCurrency)
                  : deal.exchangeAmount ?? deal.transferAmount ?? formatRub(deal.amountRub)}
              </span>
            </div>
            {cashCurrency && settledCashAmount !== null && requestedCashAmount !== null
              && settledCashAmount !== requestedCashAmount ? (
              <div className={styles.fact}>
                <span className={styles.label}>Сумма заявки</span>
                <span className={styles.value}>
                  {formatCashAmount(requestedCashAmount, cashCurrency)}
                </span>
              </div>
            ) : null}
            <div className={styles.fact}>
              <span className={styles.label}>Направление</span>
              <span className={styles.value}>{dealDirection(deal)}</span>
            </div>
            {!['Перевод', 'Инвойс'].includes(deal.dealType) ? <div className={styles.fact}>
              <span className={styles.label}>Контрагент</span>
              <span className={styles.value}>{details.counterpartyName ?? 'Не указан'}</span>
            </div> : null}
            {!['Перевод', 'Инвойс'].includes(deal.dealType) ? <div className={styles.fact}>
              <span className={styles.label}>{['Продажа', 'Покупка'].includes(deal.dealType) && details.body?.referrer_spread_rub !== undefined ? 'Спред КТ' : 'КТ-процент'}</span>
              <span className={styles.value}>
                {['Продажа', 'Покупка'].includes(deal.dealType) && details.body?.referrer_spread_rub !== undefined
                  ? `${String(details.body.referrer_spread_rub)} RUB/ед.`
                  : details.counterpartyPercent != null ? `${details.counterpartyPercent}%` : 'Не указан'}
              </span>
            </div> : null}
            {details.referrerRewardRub != null ? <div className={styles.fact}>
              <span className={styles.label}>Вознаграждение КТ (расчёт)</span>
              <span className={styles.value}>{formatMoneyRub(details.referrerRewardRub)}</span>
            </div> : null}
            {spreadPayment?.status === 'paid' || spreadPayment?.status === 'reversed' ? (
              <div className={styles.fact}>
                <span className={styles.label}>
                  {spreadPayment.status === 'paid' ? 'Спред КТ выплачен' : 'Спред КТ возвращён при отмене'}
                </span>
                <span className={styles.value}>{spreadPayment.amount_rub} RUB</span>
              </div>
            ) : null}
            {!['Перевод', 'Инвойс'].includes(deal.dealType) ? <div className={styles.fact}>
              <span className={styles.label}>Прибыль</span>
              <span className={styles.value}>{formatRub(details.profitRub)}</span>
            </div> : null}
            <div className={styles.fact}>
              <span className={styles.label}>Источник</span>
              <span className={styles.value}>{details.source}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>Создал</span>
              <span className={styles.value}>{deal.createdBy}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.label}>Обновлено</span>
              <span className={styles.value}>{details.updatedAt}</span>
            </div>
          </div>
          {details.comment ? <p className={styles.comment}>{details.comment}</p> : null}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Статусы</h2>
          <div className={styles.events}>
            {details.statusEvents.map((event) => (
              <div key={event.id} className={styles.event}>
                <span className={styles.eventTitle}>
                  {event.oldStatus ? `${event.oldStatus} → ${event.newStatus}` : event.newStatus}
                </span>
                <span className={styles.eventMeta}>
                  {event.createdAt} · {event.actorName}
                </span>
                {event.comment ? <span className={styles.eventMeta}>{event.comment}</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {details.bestChange ? (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Детализация BestChange</h2>
          <div className={styles.bestChangeGrid}>
            <BestChangeFact
              label="Операция"
              value={bestChangeOperation(details.bestChange.operation)}
            />
            <BestChangeFact label="Город" value={deal.city} />
            <BestChangeFact label="Дата сделки" value={details.dealAt ?? 'Не указана'} />
            <BestChangeFact
              label="Количество"
              value={formatOptional(details.bestChange.qtyUsdt, formatUsdt)}
            />
            <BestChangeFact
              label="Курс биржи"
              value={formatOptional(details.bestChange.marketRateRub, formatRate)}
            />
            <BestChangeFact
              label="Курс клиента"
              value={formatOptional(details.bestChange.clientRateRub, formatRate)}
            />
            <BestChangeFact
              label="Спред за USDT"
              value={formatOptional(details.bestChange.unitSpreadRub, formatMoneyRub)}
            />
            <BestChangeFact
              label="Валовый спред"
              value={formatOptional(details.bestChange.grossSpreadRub, formatMoneyRub)}
            />
            <BestChangeFact
              label="Фонд прибыли"
              value={formatOptional(details.bestChange.profitPoolRub, formatMoneyRub)}
            />
            <BestChangeFact
              label="Доля партнёра"
              value={formatOptional(details.bestChange.partnerShareRub, formatMoneyRub)}
            />
            <BestChangeFact
              label="Прибыль SkyEx"
              value={formatOptional(details.bestChange.skyexProfitRub, formatMoneyRub)}
            />
            <BestChangeFact
              label="Комиссия CoinDrop"
              value={formatOptional(details.bestChange.platformFeeUsdt, formatUsdt)}
            />
          </div>
          {details.bestChange.originalDealId || details.bestChange.replacementDealId ? (
            <div className={styles.correction}>
              <strong>Исправление сделки</strong>
              <span>
                {details.bestChange.originalDealId ? (
                  <>
                    Создана вместо{' '}
                    <Link href={`/deals/${details.bestChange.originalDealId}`}>
                      сделки #{details.bestChange.originalDealId}
                    </Link>
                  </>
                ) : (
                  <>
                    Заменена на{' '}
                    <Link href={`/deals/${details.bestChange.replacementDealId}`}>
                      сделку #{details.bestChange.replacementDealId}
                    </Link>
                  </>
                )}
              </span>
              {details.bestChange.correctionReason ? (
                <span>{details.bestChange.correctionReason}</span>
              ) : null}
              {details.bestChange.correctionActor ? (
                <span>Исправил: {details.bestChange.correctionActor}</span>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {canManage && ((details.sourceKind === 'exchange' && ['Продажа', 'Покупка'].includes(deal.dealType)
        && (details.referrerRewardRub ?? 0) > 0 && deal.status === 'done') ||
        (details.sourceKind && !['done', 'canceled'].includes(deal.status) && (
        details.source === 'tg_bot' || (
          details.source === 'crm' && (
            (details.sourceKind === 'exchange' &&
              ['Продажа', 'Покупка', 'Конвертация'].includes(deal.dealType)) ||
            details.sourceKind === 'cash'
          )
        )
      ))) ? (
        <DealSourceActions details={details} />
      ) : null}

      {details.sourceKind === 'invoice' ? <InvoicePanel details={details} canManage={canManage} /> : null}
      {canManage ? <DealManagementPanel details={details} settlements={settlements} /> : null}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Денежные ноги</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Направление</th>
              <th>Валюта</th>
              <th>Сумма</th>
              <th>Курс</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {details.legs.map((leg) => (
              <tr key={leg.id}>
                <td>{leg.direction}</td>
                <td>{leg.currency}</td>
                <td>{formatMoney({ currency: leg.currency, amount: leg.amount })}</td>
                <td>{leg.rate ?? '—'}</td>
                <td>{leg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function BestChangeFact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

function formatOptional(
  value: number | null | undefined,
  formatter: (amount: number) => string,
): string {
  return value == null ? 'Нет данных' : formatter(value);
}

function finiteAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function formatCashAmount(amount: number, currency: string): string {
  if (currency === 'RUB') return formatMoneyRub(amount);
  return `${amount.toLocaleString('ru-RU', { maximumFractionDigits: 8 })} ${currency}`;
}

function bestChangeOperation(operation: 'purchase' | 'sale' | 'unknown'): string {
  if (operation === 'purchase') return 'Покупка';
  if (operation === 'sale') return 'Продажа';
  return 'Не указана';
}

function formatUsdt(value: number): string {
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 6 })} USDT`;
}

function formatRate(value: number): string {
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 6 })} ₽`;
}
