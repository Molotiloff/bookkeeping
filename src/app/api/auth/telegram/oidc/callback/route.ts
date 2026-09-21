import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getApiRuntimeConfig } from '@/api/config';
import type { TelegramLoginResponse } from '@/services/api/adapters';
import { getTelegramOidcConfig, OIDC_COOKIES } from '../config';

const SESSION_COOKIE = 'crm_access_token';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export async function GET(request: NextRequest) {
  const oidc = getTelegramOidcConfig();
  if (!oidc) return loginRedirect(request.nextUrl.origin, 'configuration');

  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const expectedState = request.cookies.get(OIDC_COOKIES.state)?.value;
  const nonce = request.cookies.get(OIDC_COOKIES.nonce)?.value;
  const verifier = request.cookies.get(OIDC_COOKIES.verifier)?.value;
  if (!code || !nonce || !verifier || !safeEqual(state, expectedState)) {
    if (request.cookies.has(SESSION_COOKIE)) {
      return NextResponse.redirect(new URL('/', oidc.origin));
    }
    return loginRedirect(oidc.origin, 'state');
  }

  const api = getApiRuntimeConfig();
  if (!api.baseUrl) return loginRedirect(oidc.origin, 'configuration');

  let response: Response;
  try {
    response = await fetch(`${api.baseUrl.replace(/\/+$/, '')}/auth/telegram/oidc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        code_verifier: verifier,
        redirect_uri: oidc.redirectUri,
        nonce,
      }),
      cache: 'no-store',
    });
  } catch {
    return loginRedirect(oidc.origin, 'service');
  }

  if (!response.ok) {
    const detail = await response.text();
    console.error('Telegram OIDC backend rejected login', {
      status: response.status,
      detail: detail.slice(0, 500),
    });
    return loginRedirect(oidc.origin, response.status === 403 ? 'access' : 'service');
  }

  const session = (await response.json()) as TelegramLoginResponse;
  const landingPath = ['manager', 'accountant', 'owner', 'admin'].includes(session.user.role)
    ? '/'
    : '/clients';
  const redirect = NextResponse.redirect(new URL(landingPath, oidc.origin));
  clearOidcCookies(redirect);
  redirect.cookies.set(SESSION_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: oidc.secureCookies,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return redirect;
}

function safeEqual(actual: string | null, expected: string | undefined): boolean {
  if (!actual || !expected || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

function loginRedirect(origin: string, error: string): NextResponse {
  const response = NextResponse.redirect(new URL(`/login?error=${error}`, origin));
  clearOidcCookies(response);
  return response;
}

function clearOidcCookies(response: NextResponse): void {
  Object.values(OIDC_COOKIES).forEach((name) => {
    response.cookies.set(name, '', { path: '/', maxAge: 0 });
  });
}
