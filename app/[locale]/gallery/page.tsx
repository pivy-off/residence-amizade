import { redirect } from 'next/navigation';
import { getFullLocalizedPath } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/params';

interface GalleryEnPageProps {
  params: { locale?: string } | Promise<{ locale?: string }> | undefined;
}

export default async function GalleryEnPage({ params }: GalleryEnPageProps) {
  await getLocaleFromParams(params);
  redirect(getFullLocalizedPath('/galerie', 'en'));
}
