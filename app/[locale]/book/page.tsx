import { redirect } from 'next/navigation';
import { Locale } from '@/types';
import { getFullLocalizedPath } from '@/lib/i18n';

interface BookEnPageProps {
  params: { locale: Locale };
}

export default function BookEnPage({ params }: BookEnPageProps) {
  redirect(getFullLocalizedPath('/reserver', 'en'));
}
