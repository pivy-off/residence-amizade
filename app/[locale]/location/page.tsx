import { redirect } from 'next/navigation';
import { Locale } from '@/types';
import { getFullLocalizedPath } from '@/lib/i18n';

interface LocationEnPageProps {
  params: { locale: Locale };
}

export default function LocationEnPage({ params }: LocationEnPageProps) {
  redirect(getFullLocalizedPath('/localisation', 'en'));
}
