import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = new Set(['/login', '/api/auth/telegram/callback']);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  headers.set('x-crm-pathname', pathname);

  if (
    process.env.CRM_USE_API === 'true' &&
    process.env.CRM_DEV_AUTH_BYPASS !== 'true' &&
    !PUBLIC_PATHS.has(pathname) &&
    !request.cookies.has('crm_access_token')
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
