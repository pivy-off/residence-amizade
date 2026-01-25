import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.residenceamizade.sn';
  
  const routes = [
    '',
    '/chambres',
    '/rooms',
    '/galerie',
    '/gallery',
    '/localisation',
    '/location',
    '/avis',
    '/reviews',
    '/reserver',
    '/book',
    '/contact',
    '/en',
    '/en/chambres',
    '/en/rooms',
    '/en/galerie',
    '/en/gallery',
    '/en/localisation',
    '/en/location',
    '/en/avis',
    '/en/reviews',
    '/en/reserver',
    '/en/book',
    '/en/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' || route === '/en' ? 1.0 : 0.8,
  }));
}
