import { NextRequest, NextResponse } from 'next/server';
import { getApiRuntimeConfig } from '@/api/config';
import type {
  TelegramLoginPayload,
  TelegramLoginResponse,
} from '@/services/api/adapters';

const SESSION_COOKIE = 'crm_access_token';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export async function GET(request: NextRequest) {
  const payload = telegramPayload(request.nextUrl.searchParams);
  const config = getApiRuntimeConfig();
  if (!payload || !config.baseUrl) {
    return NextResponse.redirect(new URL('/login?error=configuration', request.url));
  }

  const response = await fetch(`${config.baseUrl.replace(/\/+$/, '')}/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!response.ok) {
    return NextResponse.redirect(new URL('/login?error=access', request.url));
  }

  const session = (await response.json()) as TelegramLoginResponse;
  const landingPath = ['accountant', 'owner', 'admin'].includes(session.user.role)
    ? '/'
    : '/clients';
  const redirect = NextResponse.redirect(new URL(landingPath, request.url));
  redirect.cookies.set(SESSION_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return redirect;
}

function telegramPayload(params: URLSearchParams): TelegramLoginPayload | null {
  const id = Number(params.get('id'));
  const authDate = Number(params.get('auth_date'));
  const hash = params.get('hash');
  if (!Number.isSafeInteger(id) || !Number.isSafeInteger(authDate) || !hash) return null;

  return {
    id,
    auth_date: authDate,
    hash,
    first_name: params.get('first_name'),
    last_name: params.get('last_name'),
    username: params.get('username'),
    photo_url: params.get('photo_url'),
  };
}
