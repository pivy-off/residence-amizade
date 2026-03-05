import { Locale } from '@/types';
import { defaultLocale, locales } from './i18n';

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  const frRoutes = ['chambres', 'galerie', 'localisation', 'avis', 'reserver'];
  const enRoutes = ['rooms', 'gallery', 'location', 'reviews', 'book'];
  
  if (frRoutes.includes(firstSegment)) {
    return 'fr';
  }
  
  if (enRoutes.includes(firstSegment)) {
    return 'en';
  }
  
  return defaultLocale;
}

export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname.startsWith('/en')) {
    return 'en';
  }
  return 'fr';
}
