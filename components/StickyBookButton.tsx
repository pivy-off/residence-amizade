'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import { getWhatsAppLink } from '@/lib/utils';
import businessData from '@/content/data.json';
import Link from 'next/link';

interface StickyBookButtonProps {
  locale: Locale;
}

export default function StickyBookButton({ locale }: StickyBookButtonProps) {
  const t = getTranslations(locale);
  const [isVisible, setIsVisible] = useState(false);
  const whatsAppLink = getWhatsAppLink(businessData.business.whatsapp, t.common.bookViaWhatsApp);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 md:hidden">
      <Link
        href={getFullLocalizedPath('/reserver', locale)}
        className="btn-orange shadow-apple-xl px-6 py-4 text-base font-semibold flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {locale === 'fr' ? 'Réserver' : 'Book Now'}
      </Link>
    </div>
  );
}
