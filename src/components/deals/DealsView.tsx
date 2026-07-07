'use client';

import { useMemo, useState } from 'react';
import type { DealsPageData } from '@/types/deals';
import { dealDirection } from '@/types/deals';
import { DealsHeader } from './DealsHeader';
import { DealStatusSummaryGrid } from './DealStatusSummary';
import { KanbanBoard } from './KanbanBoard';
import { AllDealsTable } from './AllDealsTable';

/** Город и поиск фильтруют и kanban, и общий реестр */
export function DealsView({ data }: { data: DealsPageData }) {
  const [city, setCity] = useState('ALL');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.deals.filter((deal) => {
      if (city !== 'ALL' && deal.city !== city) return false;
      if (!q) return true;
      return (
        deal.id.toLowerCase().includes(q) ||
        deal.clientName.toLowerCase().includes(q) ||
        deal.clientShortName.toLowerCase().includes(q) ||
        dealDirection(deal).toLowerCase().includes(q)
      );
    });
  }, [data.deals, city, query]);

  const kanbanDeals = filtered.filter((deal) => deal.onKanban);

  return (
    <>
      <DealsHeader
        cities={data.cities}
        city={city}
        onCityChange={setCity}
        query={query}
        onQueryChange={setQuery}
      />

      <DealStatusSummaryGrid summaries={data.summaries} />
      <KanbanBoard deals={kanbanDeals} summaries={data.summaries} />
      <AllDealsTable deals={filtered} />
    </>
  );
}
