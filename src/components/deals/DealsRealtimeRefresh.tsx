'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface DealsRealtimeRefreshProps {
  wsUrl: string;
  pollingIntervalMs?: number;
}

const DEAL_EVENT_PREFIX = 'deal.';

export function DealsRealtimeRefresh({
  wsUrl,
  pollingIntervalMs = 5_000,
}: DealsRealtimeRefreshProps) {
  const pathname = usePathname();
  const router = useRouter();
  const lastRefreshAt = useRef(0);

  useEffect(() => {
    if (pathname !== '/' && !pathname.startsWith('/deals')) return;

    let disposed = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const refresh = () => {
      const now = Date.now();
      if (now - lastRefreshAt.current < 500) return;
      lastRefreshAt.current = now;
      router.refresh();
    };

    const pollingTimer = setInterval(refresh, pollingIntervalMs);
    const endpoint = dealsWebSocketUrl(wsUrl);

    const connect = () => {
      if (!endpoint || disposed) return;

      socket = new WebSocket(endpoint);
      socket.onmessage = ({ data }) => {
        try {
          const event = JSON.parse(String(data)) as { type?: unknown };
          if (typeof event.type === 'string' && event.type.startsWith(DEAL_EVENT_PREFIX)) {
            refresh();
          }
        } catch {
          // Ignore malformed messages and keep the connection alive.
        }
      };
      socket.onclose = () => {
        if (!disposed) reconnectTimer = setTimeout(connect, 2_000);
      };
    };

    connect();

    return () => {
      disposed = true;
      clearInterval(pollingTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [pathname, pollingIntervalMs, router, wsUrl]);

  return null;
}

function dealsWebSocketUrl(wsUrl: string): string {
  const base = wsUrl.replace(/\/+$/, '');
  if (!base) return '';
  if (base.endsWith('/ws/deals')) return base;
  if (base.endsWith('/ws')) return `${base}/deals`;
  return `${base}/ws/deals`;
}
