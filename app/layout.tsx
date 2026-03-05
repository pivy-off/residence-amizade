import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import businessData from '@/content/data.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.residenceamizade.sn'),
  title: 'Résidence Amizade - Hôtel à Ziguinchor, Sénégal',
  description: 'Résidence Amizade, un hôtel calme et accueillant à Ziguinchor, près de l\'hôpital régional. Chambres propres, jardin paisible, excellent rapport qualité-prix.',
};

function getStructuredData(): string | null {
  try {
    const b = businessData?.business;
    if (!b) return null;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: b.name ?? 'Résidence Amizade',
      image: 'https://www.residenceamizade.sn/images/og-image.jpg',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ziguinchor',
        addressCountry: 'SN',
        streetAddress: b.addressDetailed ?? '',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: b.latitude ?? '12.5833',
        longitude: b.longitude ?? '-16.2719',
      },
      telephone: b.phone ?? '',
      priceRange: '$$',
      sameAs: [
        ...(b.mapsUrl ? [b.mapsUrl] : []),
        ...('instagram' in b && typeof b.instagram === 'string' ? [b.instagram] : []),
      ],
    };
    return JSON.stringify(data).replace(/</g, '\\u003c');
  } catch {
    return null;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredDataJson = getStructuredData();

  return (
    <html lang="fr" style={{ background: '#ffffff' }}>
      <head>
        {structuredDataJson != null && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: structuredDataJson }}
          />
        )}
      </head>
      <body
        className={inter.className}
        style={{
          margin: 0,
          backgroundColor: '#ffffff',
          color: '#111827',
          minHeight: '100vh',
        }}
      >
        <noscript>
          <div style={{ padding: 24, textAlign: 'center', fontFamily: 'sans-serif' }}>
            <p>Résidence Amizade – Ziguinchor.</p>
            <a href="/fr">Accéder au site</a>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
