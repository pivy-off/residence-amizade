import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import businessData from '@/content/data.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.residenceamizade.sn'),
  title: 'Résidence Amizade - Hôtel à Ziguinchor, Sénégal',
  description: 'Résidence Amizade, un hôtel calme et accueillant à Ziguinchor, près de l\'hôpital régional. Chambres propres, jardin paisible, excellent rapport qualité-prix.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: businessData.business.name,
    image: 'https://www.residenceamizade.sn/images/og-image.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ziguinchor',
      addressCountry: 'SN',
      streetAddress: businessData.business.addressDetailed,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: businessData.business.latitude,
      longitude: businessData.business.longitude,
    },
    telephone: businessData.business.phone,
    priceRange: '$$',
    sameAs: [
      // TODO: Add Facebook page URL when available
      // TODO: Add Google Maps URL when available
    ],
  };

  return (
    <html lang="fr">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
