import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import { generatePageMetadata as genMeta } from '@/lib/metadata';
import { getLocaleFromParams, resolveParams } from '@/lib/params';
import businessData from '@/content/data.json';
import { getWhatsAppLink } from '@/lib/utils';
import type { Metadata } from 'next';

interface RoomDetailPageProps {
  params: { locale?: Locale; id?: string } | Promise<{ locale?: Locale; id?: string }> | undefined;
}

export async function generateMetadata({ params }: RoomDetailPageProps): Promise<Metadata> {
  const resolved = (params != null ? await resolveParams(params) : undefined) ?? {};
  const locale = await getLocaleFromParams(params);
  const id = resolved?.id ?? '';
  const room = businessData.rooms.find(r => r.id === id);
  
  if (!room) {
    return genMeta({
      title: 'Room Not Found',
      description: '',
      locale,
      path: getFullLocalizedPath('/chambres', locale),
    });
  }
  
  const t = getTranslations(locale);
  
  return genMeta({
    title: `${room.name[locale]} - Résidence Amizade`,
    description: room.description?.[locale] || t.rooms.subtitle,
    locale,
    path: getFullLocalizedPath(`/chambres/${id}`, locale),
  });
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const resolved = (params != null ? await resolveParams(params) : undefined) ?? {};
  const locale = await getLocaleFromParams(params);
  const id = resolved?.id ?? '';
  const t = getTranslations(locale);
  const room = businessData.rooms.find(r => r.id === id);
  
  if (!room) {
    notFound();
  }
  
  const roomName = room.name[locale];
  const roomDescription = room.description?.[locale] || '';
  const roomBeds = room.beds?.[locale] || '';
  const roomSize = room.size?.[locale] || '';
  const whatsAppLink = getWhatsAppLink(businessData.business.whatsapp, `${locale === 'fr' ? 'Réservation' : 'Booking'}: ${roomName}`);

  return (
    <div className="container-custom section-padding">
      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {(room.images || []).map((image, index) => (
          <div key={index} className={`relative h-64 md:h-96 rounded-apple-lg overflow-hidden bg-gray-200 ${index === 0 ? 'md:col-span-2' : ''}`}>
            <Image
              src={image}
              alt={`${roomName} - ${index + 1}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">{roomName}</h1>
          
          {roomDescription && (
            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-light">{roomDescription}</p>
          )}

          {/* Icons List */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">{t.rooms.capacity}</span>
              </div>
              <p className="text-gray-600">{room.capacity} {t.rooms.guests}</p>
            </div>
            {roomBeds && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">{locale === 'fr' ? 'Lits' : 'Beds'}</span>
                </div>
                <p className="text-gray-600">{roomBeds}</p>
              </div>
            )}
            {roomSize && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">{locale === 'fr' ? 'Taille' : 'Size'}</span>
                </div>
                <p className="text-gray-600">{roomSize}</p>
              </div>
            )}
          </div>

          {/* What's Included */}
          <div className="mb-12">
            <h2 className="text-3xl font-light mb-6 tracking-tight">{t.rooms.amenities}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-orange-500 text-lg">✓</span>
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="card-apple p-8 bg-gray-50">
            <h2 className="text-2xl font-light mb-6 tracking-tight">
              {locale === 'fr' ? 'Politiques' : 'Policies'}
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-1">{t.rooms.faq.checkin.q}</p>
                <p className="text-gray-700">{t.rooms.faq.checkin.a}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{t.rooms.faq.checkout.q}</p>
                <p className="text-gray-700">{t.rooms.faq.checkout.a}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{t.rooms.faq.cancellation.q}</p>
                <p className="text-gray-700">{t.rooms.faq.cancellation.a}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{t.rooms.faq.payment.q}</p>
                <p className="text-gray-700">{t.rooms.faq.payment.a}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-apple p-8 sticky top-24">
            <div className="mb-8">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {locale === 'fr' ? 'À partir de' : 'From'}
              </p>
              <p className="text-4xl font-light text-gray-900 mb-1">{room.priceFrom} XOF</p>
              <p className="text-sm text-gray-500">{locale === 'fr' ? 'par nuit' : 'per night'}</p>
              <p className="text-xs text-gray-400 mt-2">{t.rooms.confirmPrice}</p>
            </div>
            
            <div className="space-y-4">
              <Link
                href={getFullLocalizedPath('/reserver', locale)}
                className="btn-primary w-full text-center block"
              >
                {t.rooms.bookNow}
              </Link>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange w-full text-center block"
              >
                {t.common.bookViaWhatsApp}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
