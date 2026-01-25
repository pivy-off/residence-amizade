import Link from 'next/link';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import { generatePageMetadata as genMeta } from '@/lib/metadata';
import ReviewCard from '@/components/ReviewCard';
import businessData from '@/content/data.json';
import type { Metadata } from 'next';

interface ReviewsPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: ReviewsPageProps): Promise<Metadata> {
  const { locale } = params;
  const t = getTranslations(locale);
  
  return genMeta({
    title: `${t.reviews.title} - Résidence Amizade`,
    description: t.reviews.subtitle,
    locale,
    path: getFullLocalizedPath('/avis', locale),
  });
}

export default function ReviewsPage({ params }: ReviewsPageProps) {
  const { locale } = params;
  const t = getTranslations(locale);
  const reviews = businessData.reviews;

  return (
    <div className="container-custom section-padding">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold mb-5 tracking-tight">{t.reviews.title}</h1>
        <p className="text-xl text-gray-600 font-light">{t.reviews.subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 card-apple p-10 bg-blue-50">
        <h2 className="text-3xl font-semibold mb-5 tracking-tight text-gray-900">{t.reviews.leaveReview}</h2>
        <p className="text-gray-700 mb-8 text-base leading-relaxed">{t.reviews.leaveReviewText}</p>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-orange"
        >
          {t.reviews.googleReview}
        </a>
        <p className="text-sm text-gray-500 mt-6">TODO: Replace # with actual Google Maps review URL</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
