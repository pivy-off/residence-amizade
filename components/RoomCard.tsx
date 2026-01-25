import Image from 'next/image';
import Link from 'next/link';
import { Room } from '@/types';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';

interface RoomCardProps {
  room: Room;
  locale: Locale;
}

export default function RoomCard({ room, locale }: RoomCardProps) {
  const t = getTranslations(locale);
  const roomName = room.name[locale];
  const roomAmenities = locale === 'fr' ? room.amenities : room.amenities; // In a real app, amenities would be translated

  const bedType = roomAmenities.find(a => a.toLowerCase().includes('lit') || a.toLowerCase().includes('bed')) || 
    (room.capacity === 1 ? (locale === 'fr' ? 'Lit simple' : 'Single bed') : 
     room.capacity === 2 ? (locale === 'fr' ? 'Lit double' : 'Double bed') : 
     locale === 'fr' ? 'Lit double + lit simple' : 'Double + single bed');

  return (
    <Link href={getFullLocalizedPath(`/chambres/${room.id}`, locale)} className="card-apple group block">
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src={room.images[0] || '/images/placeholder-room.jpg'}
          alt={roomName}
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {room.images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-apple text-xs font-medium text-gray-700">
            {room.images.length} {locale === 'fr' ? 'photos' : 'photos'}
          </div>
        )}
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-light mb-4 text-gray-900 tracking-tight">{roomName}</h3>
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{bedType}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{room.capacity} {t.rooms.guests}</span>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t.rooms.amenities}</p>
          <ul className="text-sm text-gray-600 space-y-1.5">
            {roomAmenities.slice(0, 3).map((amenity, index) => (
              <li key={index} className="flex items-center">
                <span className="text-orange-500 mr-2 text-xs">•</span>
                <span>{amenity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-end justify-between mt-8 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{locale === 'fr' ? 'À partir de' : 'From'}</p>
            <p className="text-3xl font-light text-gray-900 mb-1">{room.priceFrom} XOF</p>
            <p className="text-xs text-gray-400">{locale === 'fr' ? 'par nuit' : 'per night'}</p>
          </div>
          <span className="btn-primary text-sm px-6 py-3">
            {t.rooms.bookNow}
          </span>
        </div>
      </div>
    </Link>
  );
}
