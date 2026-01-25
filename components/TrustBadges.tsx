import { Locale } from '@/types';

interface TrustBadgesProps {
  locale: Locale;
}

export default function TrustBadges({ locale }: TrustBadgesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 py-8 border-t border-b border-gray-200">
      <div className="flex items-center gap-2 text-gray-700">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-sm font-medium">
          {locale === 'fr' ? 'Réservation sécurisée' : 'Secure booking'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">
          {locale === 'fr' ? 'Meilleur prix garanti' : 'Best price guarantee'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">
          {locale === 'fr' ? 'Annulation gratuite' : 'Free cancellation'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">
          {locale === 'fr' ? 'Avis vérifiés' : 'Verified reviews'}
        </span>
      </div>
    </div>
  );
}
