import Header from '@/components/Header';
import MobileBottomBar from '@/components/MobileBottomBar';
import Footer from '@/components/Footer';
import StickyBookButton from '@/components/StickyBookButton';
import { Locale } from '@/types';
import { locales, defaultLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      <Footer locale={locale} />
      <StickyBookButton locale={locale} />
      <MobileBottomBar locale={locale} />
    </>
  );
}
