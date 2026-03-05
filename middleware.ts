import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'en'] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root: redirect to French
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }

  // /fr or /en (with or without trailing slash) - allow
  const segment = pathname.split('/')[1];
  if (segment && locales.includes(segment as 'fr' | 'en')) {
    return NextResponse.next();
  }

  // Invalid locale in first segment (e.g. /xyz/...) - redirect to /fr
  if (pathname.startsWith('/') && pathname.length > 1) {
    const first = pathname.slice(1).split('/')[0];
    if (first && !locales.includes(first as 'fr' | 'en')) {
      const rest = pathname.slice(first.length + 2) || '';
      return NextResponse.redirect(new URL(`/fr/${rest}`.replace(/\/+$/, '') || '/fr', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|logo|robots.txt|sitemap).*)'],
};
