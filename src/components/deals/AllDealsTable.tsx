'use client';

import { useState } from 'react';
import type { DealItem } from '@/types/deals';
import { dealDirection } from '@/types/deals';
import { formatRub } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import styles from './AllDealsTable.module.css';

const PAGE_SIZES = [10, 20, 50];

export function AllDealsTable({ deals }: { deals: DealItem[] }) {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const handleRowClick = (dealId: string) => {
    // TODO: открыть карточку сделки
    console.log(dealId);
  };

  const totalPages = Math.max(1, Math.ceil(deals.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = deals.slice(start, start + pageSize);

  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>Все сделки</h2>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.firstHead}>ID сделки</th>
              <th>Клиент</th>
              <th>Тип сделки</th>
              <th>Направление</th>
              <th className={styles.amountHead}>Сумма</th>
              <th>Город</th>
              <th>Статус</th>
              <th>Обновлено</th>
              <th className={styles.lastHead}>Создал</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((deal) => (
              <tr key={deal.id} className={styles.row} onClick={() => handleRowClick(deal.id)}>
                <td className={styles.firstCol}>{deal.id}</td>
                <td className={styles.clientCol}>{deal.clientName}</td>
                <td>{deal.dealType}</td>
                <td>{dealDirection(deal)}</td>
                <td className={styles.amountCol}>{formatRub(deal.amountRub)}</td>
                <td>{deal.city}</td>
                <td>
                  <StatusBadge status={deal.status} />
                </td>
                <td>{deal.updatedLabel}</td>
                <td className={styles.lastCol}>{deal.createdBy}</td>
              </tr>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.emptyCell}>
                  Ничего не найдено — измените фильтр или запрос.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <label className={styles.pageSize}>
          <span>Показать по:</span>
          <span className={styles.pageSizeSelectWrap}>
            <select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              aria-label="Сделок на странице"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={13} className={styles.pageSizeChevron} />
          </span>
        </label>

        <div className={styles.pagination}>
          <span className={styles.range}>
            {deals.length === 0 ? '0' : `${start + 1}–${Math.min(start + pageSize, deals.length)}`}{' '}
            из {deals.length}
          </span>
          <button
            type="button"
            className={styles.pageArrow}
            aria-label="Предыдущая страница"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <Icon name="chevron-left" size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`${styles.pageButton} ${n === currentPage ? styles.pageButtonActive : ''}`}
              aria-current={n === currentPage ? 'page' : undefined}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageArrow}
            aria-label="Следующая страница"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
      </footer>
    </section>
  );
}
