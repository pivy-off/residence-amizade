import { redirect } from 'next/navigation';
import { getFullLocalizedPath } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/params';

interface LocationEnPageProps {
  params: { locale?: string } | Promise<{ locale?: string }> | undefined;
}

export default async function LocationEnPage({ params }: LocationEnPageProps) {
  await getLocaleFromParams(params);
  redirect(getFullLocalizedPath('/localisation', 'en'));
}
