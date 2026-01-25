import { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface QuickHighlightsProps {
  locale: Locale;
}

export default function QuickHighlights({ locale }: QuickHighlightsProps) {
  const t = getTranslations(locale);
  
  const highlights = [
    { icon: 'wifi', label: locale === 'fr' ? 'WiFi gratuit' : 'Free WiFi' },
    { icon: 'breakfast', label: locale === 'fr' ? 'Petit-déjeuner' : 'Breakfast' },
    { icon: 'transfer', label: locale === 'fr' ? 'Transfert aéroport' : 'Airport transfer' },
    { icon: 'quiet', label: locale === 'fr' ? 'Chambres calmes' : 'Quiet rooms' },
    { icon: 'hospital', label: locale === 'fr' ? 'Proche hôpital' : 'Near hospital' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
      {highlights.map((highlight, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-white/20 rounded-apple-lg flex items-center justify-center backdrop-blur-sm">
            {highlight.icon === 'wifi' && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            )}
            {highlight.icon === 'breakfast' && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
            {highlight.icon === 'transfer' && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            )}
            {highlight.icon === 'quiet' && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {highlight.icon === 'hospital' && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          </div>
          <span className="text-sm text-white/90 font-medium">{highlight.label}</span>
        </div>
      ))}
    </div>
  );
}
