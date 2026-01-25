import Link from 'next/link';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import { generatePageMetadata as genMeta } from '@/lib/metadata';
import businessData from '@/content/data.json';
import { getWhatsAppLink, getTelLink } from '@/lib/utils';
import type { Metadata } from 'next';

interface LocationPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { locale } = params;
  const t = getTranslations(locale);
  
  return genMeta({
    title: `${t.location.title} - Résidence Amizade`,
    description: t.location.subtitle,
    locale,
    path: getFullLocalizedPath('/localisation', locale),
  });
}

export default function LocationPage({ params }: LocationPageProps) {
  const { locale } = params;
  const t = getTranslations(locale);
  const whatsAppLink = getWhatsAppLink(businessData.business.whatsapp);
  const telLink = getTelLink(businessData.business.phone);

  return (
    <div className="container-custom section-padding">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold mb-5 tracking-tight">{t.location.title}</h1>
        <p className="text-xl text-gray-600 font-light">{t.location.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-3xl font-semibold mb-6 tracking-tight">{t.location.address}</h2>
          <p className="text-xl text-gray-700 mb-4 font-light">{businessData.business.addressDetailed}</p>
          <p className="text-lg text-gray-600 mb-8 font-light">{t.location.nearHospital}</p>
          
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t.location.directions}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{t.location.directionsText}</p>
          </div>

          <div className="card-apple p-8 bg-blue-50">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">{t.location.contact}</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange text-center"
              >
                {t.location.contactUs}
              </a>
              <a href={telLink} className="btn-primary text-center">
                {t.common.call}
              </a>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] rounded-apple-lg overflow-hidden bg-gray-100 shadow-apple-lg">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center p-8">
              <p className="mb-4 text-base">Map placeholder</p>
              <p className="text-sm">TODO: Add Google Maps embed iframe</p>
              <p className="text-xs mt-2">Use the embed URL from Google Maps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
