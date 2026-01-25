'use client';

import { getWhatsAppLink, getTelLink } from '@/lib/utils';
import { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';
import businessData from '@/content/data.json';

interface MobileBottomBarProps {
  locale: Locale;
}

export default function MobileBottomBar({ locale }: MobileBottomBarProps) {
  const t = getTranslations(locale);
  const phone = businessData.business.whatsapp;
  const whatsAppLink = getWhatsAppLink(phone, t.common.bookViaWhatsApp);
  const telLink = getTelLink(phone);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-apple-lg">
      <div className="flex">
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center py-5 px-4 bg-orange-500 text-white font-semibold hover:bg-orange-600 active:bg-orange-700 transition-all duration-200"
          aria-label={t.common.whatsapp}
        >
          {t.common.whatsapp}
        </a>
        <a
          href={telLink}
          className="flex-1 flex items-center justify-center py-5 px-4 bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all duration-200"
          aria-label={t.common.call}
        >
          {t.common.call}
        </a>
      </div>
    </div>
  );
}
