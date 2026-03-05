import Image from 'next/image';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import { generatePageMetadata as genMeta } from '@/lib/metadata';
import { getLocaleFromParams } from '@/lib/params';
import type { Metadata } from 'next';

interface GalleryPageProps {
  params: { locale?: Locale } | Promise<{ locale?: Locale }> | undefined;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale);
  
  return genMeta({
    title: `${t.gallery.title} - Résidence Amizade`,
    description: t.gallery.subtitle,
    locale,
    path: getFullLocalizedPath('/galerie', locale),
  });
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale);

  const galleryImages = [
    { src: '/images/gallery/exterior-1.jpg', alt: 'Vue extérieure' },
    { src: '/images/gallery/garden-1.jpg', alt: 'Jardin' },
    { src: '/images/gallery/room-1.jpg', alt: 'Chambre' },
    { src: '/images/gallery/room-2.jpg', alt: 'Chambre' },
    { src: '/images/gallery/common-area-1.jpg', alt: 'Espace commun' },
    { src: '/images/gallery/exterior-2.jpg', alt: 'Façade' },
    { src: '/images/gallery/garden-2.jpg', alt: 'Jardin' },
    { src: '/images/gallery/room-3.jpg', alt: 'Chambre' },
    { src: '/images/gallery/common-area-2.jpg', alt: 'Hall' },
  ];

  return (
    <div className="container-custom section-padding">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold mb-5 tracking-tight">{t.gallery.title}</h1>
        <p className="text-xl text-gray-600 font-light">{t.gallery.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((image, index) => (
          <div key={index} className="relative h-64 md:h-80 rounded-apple-lg overflow-hidden bg-gray-200 shadow-apple hover:shadow-apple-lg transition-all duration-300 group">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              unoptimized
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
