import { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';
import businessData from '@/content/data.json';

interface SocialProofProps {
  locale: Locale;
}

export default function SocialProof({ locale }: SocialProofProps) {
  const t = getTranslations(locale);
  const reviews = businessData.reviews;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const reviewCount = reviews.length;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-white/30'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
      </div>
      <div className="text-lg">
        {reviewCount} {locale === 'fr' ? 'avis' : 'reviews'}
      </div>
      <div className="text-sm">
        {locale === 'fr' ? 'Sur Google' : 'On Google'}
      </div>
    </div>
  );
}
