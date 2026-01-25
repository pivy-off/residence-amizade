import { Locale } from '@/types';
import { getFullLocalizedPath } from '@/lib/i18n';
import Link from 'next/link';

interface SpecialOfferProps {
  locale: Locale;
}

export default function SpecialOffer({ locale }: SpecialOfferProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-apple-lg p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent)]"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {locale === 'fr' ? 'OFFRE SPÉCIALE' : 'SPECIAL OFFER'}
            </div>
            <h3 className="text-3xl md:text-4xl font-light mb-3 tracking-tight">
              {locale === 'fr' ? 'Réservez maintenant et économisez' : 'Book now and save'}
            </h3>
            <p className="text-lg text-white/90 mb-6">
              {locale === 'fr' 
                ? 'Réservez directement et bénéficiez de nos meilleurs tarifs. Annulation gratuite jusqu\'à 48h avant l\'arrivée.'
                : 'Book directly and get our best rates. Free cancellation up to 48 hours before arrival.'}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{locale === 'fr' ? 'Meilleur prix garanti' : 'Best price guaranteed'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{locale === 'fr' ? 'Annulation gratuite' : 'Free cancellation'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{locale === 'fr' ? 'Pas de frais cachés' : 'No hidden fees'}</span>
              </div>
            </div>
          </div>
          <Link
            href={getFullLocalizedPath('/reserver', locale)}
            className="bg-white text-blue-600 px-8 py-4 rounded-apple font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            {locale === 'fr' ? 'Réserver maintenant' : 'Book now'}
          </Link>
        </div>
      </div>
    </div>
  );
}
