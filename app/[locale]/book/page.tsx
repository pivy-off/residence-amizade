import { redirect } from 'next/navigation';
import { getFullLocalizedPath } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/params';

interface BookEnPageProps {
  params: { locale?: string } | Promise<{ locale?: string }> | undefined;
}

export default async function BookEnPage({ params }: BookEnPageProps) {
  await getLocaleFromParams(params);
  redirect(getFullLocalizedPath('/reserver', 'en'));
}
