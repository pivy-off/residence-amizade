import { Metadata } from 'next';
import { Locale } from '@/types';

interface MetadataParams {
  title: string;
  description: string;
  locale: Locale;
  path: string;
}

export function generatePageMetadata({ title, description, locale, path }: MetadataParams): Metadata {
  const baseUrl = 'https://www.residenceamizade.sn';
  const canonicalUrl = `${baseUrl}${path}`;
  const alternatePath = path === '/' ? (locale === 'fr' ? '/en' : '/') : path.replace(`/${locale}`, locale === 'fr' ? '/en' : '').replace('/en', '/').replace('/rooms', '/chambres').replace('/gallery', '/galerie').replace('/location', '/localisation').replace('/reviews', '/avis').replace('/book', '/reserver');
  
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr': `${baseUrl}${locale === 'fr' ? path : alternatePath}`,
        'en': `${baseUrl}${locale === 'en' ? path : alternatePath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Résidence Amizade',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Résidence Amizade - Ziguinchor, Senegal',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/og-image.jpg`],
    },
  };
}
