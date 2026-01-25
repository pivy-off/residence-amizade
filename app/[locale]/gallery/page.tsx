import { redirect } from 'next/navigation';
import { Locale } from '@/types';
import { getFullLocalizedPath } from '@/lib/i18n';

interface GalleryEnPageProps {
  params: { locale: Locale };
}

export default function GalleryEnPage({ params }: GalleryEnPageProps) {
  redirect(getFullLocalizedPath('/galerie', 'en'));
}
