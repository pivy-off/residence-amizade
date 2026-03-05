import { Locale } from '@/types';
import { locales } from '@/lib/i18n';

/**
 * Next.js can pass params as a Promise or a plain object; params may be undefined on client nav.
 * Use this everywhere to get a valid locale. Never throws.
 */
export async function getLocaleFromParams(
  params: { locale?: Locale | string } | Promise<{ locale?: Locale | string }> | undefined | null
): Promise<Locale> {
  try {
    const resolved = params != null ? await Promise.resolve(params) : undefined;
    const locale = resolved?.locale;
    if (locale && locales.includes(locale as Locale)) return locale as Locale;
  } catch {
    // ignore
  }
  return 'fr';
}

export async function resolveParams<T>(params: T | Promise<T> | undefined | null): Promise<T | undefined> {
  try {
    if (params == null) return undefined;
    return await Promise.resolve(params);
  } catch {
    return undefined;
  }
}
