import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'en'] as const;

function addSecurityHeaders(response: NextResponse, pathname: string): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  if (pathname.includes('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes: add security headers only
  if (pathname.startsWith('/api')) {
    return addSecurityHeaders(NextResponse.next(), pathname);
  }

  // Root: redirect to French
  if (pathname === '/') {
    const res = NextResponse.redirect(new URL('/fr', request.url));
    return addSecurityHeaders(res, pathname);
  }

  // /fr or /en (with or without trailing slash) - allow
  const segment = pathname.split('/')[1];
  if (segment && locales.includes(segment as 'fr' | 'en')) {
    return addSecurityHeaders(NextResponse.next(), pathname);
  }

  // Invalid locale in first segment (e.g. /xyz/...) - redirect to /fr
  if (pathname.startsWith('/') && pathname.length > 1) {
    const first = pathname.slice(1).split('/')[0];
    if (first && !locales.includes(first as 'fr' | 'en')) {
      const rest = pathname.slice(first.length + 2) || '';
      const res = NextResponse.redirect(new URL(`/fr/${rest}`.replace(/\/+$/, '') || '/fr', request.url));
      return addSecurityHeaders(res, pathname);
    }
  }

  return addSecurityHeaders(NextResponse.next(), pathname);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|logo|robots.txt|sitemap).*)'],
};
