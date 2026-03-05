import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import { generatePageMetadata as genMeta } from '@/lib/metadata';
import { getLocaleFromParams } from '@/lib/params';
import ReviewsSection from '@/components/ReviewsSection';
import type { Metadata } from 'next';

interface ReviewsPageProps {
  params: { locale?: Locale } | Promise<{ locale?: Locale }> | undefined;
}

export async function generateMetadata({ params }: ReviewsPageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale);
  
  return genMeta({
    title: `${t.reviews.title} - Résidence Amizade`,
    description: t.reviews.subtitle,
    locale,
    path: getFullLocalizedPath('/avis', locale),
  });
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale);

  return (
    <div className="container-custom section-padding">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold mb-5 tracking-tight">{t.reviews.title}</h1>
        <p className="text-xl text-gray-600 font-light">{t.reviews.subtitle}</p>
      </div>

      <ReviewsSection locale={locale} />
    </div>
  );
}
