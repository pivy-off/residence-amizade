import { redirect } from 'next/navigation';
import { Locale } from '@/types';
import { getFullLocalizedPath } from '@/lib/i18n';

interface ReviewsEnPageProps {
  params: { locale: Locale };
}

export default function ReviewsEnPage({ params }: ReviewsEnPageProps) {
  redirect(getFullLocalizedPath('/avis', 'en'));
}
