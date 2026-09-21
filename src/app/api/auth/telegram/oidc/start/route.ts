import { createHash, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  getTelegramOidcConfig,
  OIDC_COOKIE_MAX_AGE,
  OIDC_COOKIES,
  TELEGRAM_AUTHORIZE_URL,
} from '../config';

export function GET(request: NextRequest) {
  const config = getTelegramOidcConfig();
  if (!config) {
    return NextResponse.redirect(new URL('/login?error=configuration', request.url));
  }

  const state = randomBytes(32).toString('base64url');
  const nonce = randomBytes(32).toString('base64url');
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const authorizeUrl = new URL(TELEGRAM_AUTHORIZE_URL);
  authorizeUrl.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid profile',
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString();

  const response = NextResponse.redirect(authorizeUrl);
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: config.secureCookies,
    path: '/',
    maxAge: OIDC_COOKIE_MAX_AGE,
  };
  response.cookies.set(OIDC_COOKIES.state, state, cookieOptions);
  response.cookies.set(OIDC_COOKIES.nonce, nonce, cookieOptions);
  response.cookies.set(OIDC_COOKIES.verifier, verifier, cookieOptions);
  return response;
}
