import { redirect } from 'next/navigation';
import { getFullLocalizedPath } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/params';

interface ReviewsEnPageProps {
  params: { locale?: string } | Promise<{ locale?: string }> | undefined;
}

export default async function ReviewsEnPage({ params }: ReviewsEnPageProps) {
  await getLocaleFromParams(params);
  redirect(getFullLocalizedPath('/avis', 'en'));
}
