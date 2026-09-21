const CALLBACK_PATH = '/api/auth/telegram/oidc/callback';

export const TELEGRAM_AUTHORIZE_URL = 'https://oauth.telegram.org/auth';
export const OIDC_COOKIE_MAX_AGE = 10 * 60;
export const OIDC_COOKIES = {
  state: 'crm_oidc_state',
  nonce: 'crm_oidc_nonce',
  verifier: 'crm_oidc_verifier',
} as const;

export interface TelegramOidcConfig {
  clientId: string;
  origin: string;
  redirectUri: string;
  secureCookies: boolean;
}

export function getTelegramOidcConfig(): TelegramOidcConfig | null {
  const clientId = process.env.TELEGRAM_OIDC_CLIENT_ID?.trim() ?? '';
  const rawOrigin = process.env.CRM_FRONTEND_ORIGIN?.trim() ?? '';
  if (!/^\d+$/.test(clientId) || !rawOrigin) return null;

  try {
    const origin = new URL(rawOrigin).origin;
    return {
      clientId,
      origin,
      redirectUri: `${origin}${CALLBACK_PATH}`,
      secureCookies: origin.startsWith('https://'),
    };
  } catch {
    return null;
  }
}
