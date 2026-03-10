import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/fr/admin', '/en/admin'],
    },
    sitemap: 'https://www.residenceamizade.sn/sitemap.xml',
  };
}
