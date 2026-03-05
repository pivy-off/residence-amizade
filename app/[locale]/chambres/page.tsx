import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import { generatePageMetadata as genMeta } from '@/lib/metadata';
import { getLocaleFromParams } from '@/lib/params';
import RoomCard from '@/components/RoomCard';
import businessData from '@/content/data.json';
import type { Metadata } from 'next';

interface RoomsPageProps {
  params: { locale?: Locale } | Promise<{ locale?: Locale }> | undefined;
}

export async function generateMetadata({ params }: RoomsPageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale);
  
  return genMeta({
    title: `${t.rooms.title} - Résidence Amizade`,
    description: t.rooms.subtitle,
    locale,
    path: getFullLocalizedPath('/chambres', locale),
  });
}

export default async function RoomsPage({ params }: RoomsPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale);
  const rooms = businessData.rooms;

  return (
    <div className="container-custom section-padding">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold mb-5 tracking-tight">{t.rooms.title}</h1>
        <p className="text-xl text-gray-600 font-light">{t.rooms.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} locale={locale} />
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-16 card-apple p-10">
        <h2 className="text-3xl font-semibold mb-8 tracking-tight">{t.rooms.faq.title}</h2>
        <div className="space-y-8">
          <div className="pb-6 border-b border-gray-100">
            <h3 className="font-semibold text-xl mb-3 text-gray-900">{t.rooms.faq.checkin.q}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{t.rooms.faq.checkin.a}</p>
          </div>
          <div className="pb-6 border-b border-gray-100">
            <h3 className="font-semibold text-xl mb-3 text-gray-900">{t.rooms.faq.checkout.q}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{t.rooms.faq.checkout.a}</p>
          </div>
          <div className="pb-6 border-b border-gray-100">
            <h3 className="font-semibold text-xl mb-3 text-gray-900">{t.rooms.faq.breakfast.q}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{t.rooms.faq.breakfast.a}</p>
          </div>
          <div className="pb-6 border-b border-gray-100">
            <h3 className="font-semibold text-xl mb-3 text-gray-900">{t.rooms.faq.cancellation.q}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{t.rooms.faq.cancellation.a}</p>
          </div>
          <div className="pb-6 border-b border-gray-100">
            <h3 className="font-semibold text-xl mb-3 text-gray-900">{t.rooms.faq.deposit.q}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{t.rooms.faq.deposit.a}</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-3 text-gray-900">{t.rooms.faq.payment.q}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{t.rooms.faq.payment.a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
