import { redirect } from 'next/navigation';
import { getFullLocalizedPath } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/params';

interface RoomsEnPageProps {
  params: { locale?: string } | Promise<{ locale?: string }> | undefined;
}

export default async function RoomsEnPage({ params }: RoomsEnPageProps) {
  await getLocaleFromParams(params);
  redirect(getFullLocalizedPath('/chambres', 'en'));
}
