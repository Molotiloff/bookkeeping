'use client';

import { useEffect, useRef, useState } from 'react';

interface TelegramLoginWidgetProps {
  botUsername: string;
  authUrl: string;
}

export function TelegramLoginWidget({ botUsername, authUrl }: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.childElementCount > 0) return;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '6');
    script.setAttribute('data-auth-url', authUrl);
    script.setAttribute('data-request-access', 'write');
    script.addEventListener('error', () => setFailed(true));
    container.appendChild(script);
  }, [authUrl, botUsername]);

  if (failed) {
    return <span>Не удалось загрузить вход через Telegram</span>;
  }

  return <div ref={containerRef} />;
}
