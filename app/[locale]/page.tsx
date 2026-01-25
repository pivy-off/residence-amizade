import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import { generatePageMetadata as genMeta } from '@/lib/metadata';
import businessData from '@/content/data.json';
import RoomCard from '@/components/RoomCard';
import ReviewCard from '@/components/ReviewCard';
import BookingBar from '@/components/BookingBar';
import SocialProof from '@/components/SocialProof';
import QuickHighlights from '@/components/QuickHighlights';
import Footer from '@/components/Footer';
import TrustBadges from '@/components/TrustBadges';
import SpecialOffer from '@/components/SpecialOffer';
import Newsletter from '@/components/Newsletter';
import GuestServices from '@/components/GuestServices';
import HeroBackground from '@/components/HeroBackground';
import { getWhatsAppLink } from '@/lib/utils';
import type { Metadata } from 'next';

interface HomePageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = params;
  const t = getTranslations(locale);
  
  return genMeta({
    title: `${t.home.hero.title} - ${t.home.hero.subtitle}`,
    description: t.home.hero.description,
    locale,
    path: locale === 'fr' ? '/' : '/en',
  });
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;
  const t = getTranslations(locale);
  const rooms = businessData.rooms.slice(0, 3);
  const reviews = businessData.reviews.slice(0, 3);
  const whatsAppLink = getWhatsAppLink(businessData.business.whatsapp, t.common.bookViaWhatsApp);

  return (
    <>
      {/* Hero Section with Photo/Video */}
      <section className="relative h-[90vh] min-h-[700px] flex items-end justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        {/* Hero Image/Video Background */}
        <HeroBackground />
        
        <div className="relative z-10 container-custom w-full pb-8 md:pb-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight">
              {t.home.hero.title}
            </h1>
            <p className="text-2xl md:text-3xl mb-4 font-light">{t.home.hero.subtitle}</p>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto">{t.home.hero.description}</p>
          </div>
          
          {/* Social Proof */}
          <div className="mb-8">
            <SocialProof locale={locale} />
          </div>
          
          {/* Quick Highlights */}
          <div className="mb-12">
            <QuickHighlights locale={locale} />
          </div>
        </div>
      </section>
      
      {/* Above the Fold Booking Bar */}
      <section className="relative -mt-20 md:-mt-32 mb-20 md:mb-32">
        <BookingBar locale={locale} />
      </section>
      
      {/* Trust Badges */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <TrustBadges locale={locale} />
        </div>
      </section>

      {/* Room Cards with Starting Price */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-4 tracking-tight">{t.rooms.title}</h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">{t.rooms.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} locale={locale} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-5xl md:text-6xl font-light text-center mb-16 tracking-tight">
            {locale === 'fr' ? 'Votre expérience' : 'Your Experience'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-apple p-10 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-apple-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                {locale === 'fr' ? 'Restaurant' : 'Restaurant'}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {locale === 'fr' ? 'Cuisine sur commande avec des plats locaux et internationaux' : 'On-request dining with local and international dishes'}
              </p>
            </div>
            <div className="card-apple p-10 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-apple-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                {locale === 'fr' ? 'Guide de la ville' : 'City Guide'}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {locale === 'fr' ? 'Conseils personnalisés pour découvrir Ziguinchor' : 'Personalized tips to discover Ziguinchor'}
              </p>
            </div>
            <div className="card-apple p-10 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-apple-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                {locale === 'fr' ? 'Excursions' : 'Tours'}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {locale === 'fr' ? 'Organisation d\'excursions dans la région' : 'Tour organization in the region'}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Location Section with Map, Airport Distance, WhatsApp */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">{t.home.location.title}</h2>
              <div className="space-y-6 mb-10">
                <div>
                  <p className="text-xl text-gray-700 mb-2 font-light">{businessData.business.addressDetailed}</p>
                  <p className="text-lg text-gray-600 font-light">{t.home.location.nearHospital}</p>
                </div>
                <div className="card-apple p-6 bg-blue-50">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {locale === 'fr' ? 'Distance de l\'aéroport' : 'Distance from airport'}
                  </p>
                  <p className="text-lg text-gray-900">
                    {locale === 'fr' ? 'Environ 15 minutes en voiture' : 'Approximately 15 minutes by car'}
                  </p>
                </div>
              </div>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {t.common.whatsapp}
              </a>
            </div>
            <div className="relative h-[500px] rounded-apple-lg overflow-hidden bg-gray-100 shadow-apple-lg">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center p-8">
                  <p className="mb-4 text-base">Google Maps</p>
                  <p className="text-sm">TODO: Add Google Maps embed iframe</p>
                  <p className="text-xs mt-2">Use the embed URL from Google Maps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Full Width Gallery */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-5xl md:text-6xl font-light text-center mb-16 tracking-tight">
            {t.gallery.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'exterior-1.jpg',
              'exterior-2.jpg',
              'garden-1.jpg',
              'garden-2.jpg',
              'room-1.jpg',
              'room-2.jpg',
              'room-3.jpg',
              'common-area-1.jpg',
            ].map((imageName, index) => (
              <div key={index} className="relative h-64 md:h-80 rounded-apple overflow-hidden bg-gray-200 group">
                <Image
                  src={`/images/gallery/${imageName}`}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href={getFullLocalizedPath('/galerie', locale)} className="btn-primary">
              {locale === 'fr' ? 'Voir toute la galerie' : 'View full gallery'}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Special Offer */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SpecialOffer locale={locale} />
        </div>
      </section>
      
      {/* Guest Services */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-5xl md:text-6xl font-light text-center mb-16 tracking-tight">
            {locale === 'fr' ? 'Services aux invités' : 'Guest Services'}
          </h2>
          <GuestServices locale={locale} />
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light mb-4 tracking-tight">{t.home.reviews.title}</h2>
            <p className="text-xl text-gray-600 font-light">
              {locale === 'fr' ? 'Votre satisfaction est notre priorité' : 'Your satisfaction is our priority'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="text-center">
            <Link href={getFullLocalizedPath('/avis', locale)} className="btn-primary">
              {t.home.reviews.viewAll}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <Newsletter locale={locale} />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-light text-center mb-16 tracking-tight">
            {locale === 'fr' ? 'Questions fréquentes' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t.rooms.faq.checkin.q}</h3>
              <p className="text-gray-700 leading-relaxed">{t.rooms.faq.checkin.a}</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t.rooms.faq.checkout.q}</h3>
              <p className="text-gray-700 leading-relaxed">{t.rooms.faq.checkout.a}</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t.rooms.faq.breakfast.q}</h3>
              <p className="text-gray-700 leading-relaxed">{t.rooms.faq.breakfast.a}</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t.rooms.faq.cancellation.q}</h3>
              <p className="text-gray-700 leading-relaxed">{t.rooms.faq.cancellation.a}</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t.rooms.faq.payment.q}</h3>
              <p className="text-gray-700 leading-relaxed">{t.rooms.faq.payment.a}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {locale === 'fr' ? 'Transfert aéroport disponible?' : 'Airport transfer available?'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {locale === 'fr' ? 'Oui, sur demande. Contactez-nous pour organiser votre transfert.' : 'Yes, on request. Contact us to arrange your transfer.'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
