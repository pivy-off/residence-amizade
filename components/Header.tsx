'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import Logo from './Logo';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const t = getTranslations(locale);

  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'rooms', path: '/chambres' },
    { key: 'gallery', path: '/galerie' },
    { key: 'location', path: '/localisation' },
    { key: 'reviews', path: '/avis' },
    { key: 'book', path: '/reserver' },
    { key: 'contact', path: '/contact' },
  ];

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'fr' ? 'en' : 'fr';
    // Remove locale prefix if present
    let currentPath = pathname;
    if (currentPath.startsWith('/fr') || currentPath.startsWith('/en')) {
      currentPath = currentPath.replace(/^\/(fr|en)/, '');
      if (!currentPath) currentPath = '/';
    }
    const newPath = getFullLocalizedPath(currentPath, newLocale);
    window.location.href = newPath;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-apple">
      <nav className="container-custom py-5">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="hover:opacity-80 transition-opacity">
            <Logo locale={locale} />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const href = getFullLocalizedPath(link.path, locale);
              const isActive = pathname === href || (link.path === '/' && pathname === `/${locale}`);
              return (
                <Link
                  key={link.key}
                  href={href}
                  className={`px-4 py-2 rounded-apple text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {t.nav[link.key as keyof typeof t.nav]}
                </Link>
              );
            })}
            <button
              onClick={toggleLocale}
              className="px-4 py-2 rounded-apple text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
              aria-label="Toggle language"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleLocale}
              className="px-3 py-2 rounded-apple text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Toggle language"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
