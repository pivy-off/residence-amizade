import { redirect } from 'next/navigation';
import { Locale } from '@/types';
import { getFullLocalizedPath } from '@/lib/i18n';

interface RoomsEnPageProps {
  params: { locale: Locale };
}

export default function RoomsEnPage({ params }: RoomsEnPageProps) {
  redirect(getFullLocalizedPath('/chambres', 'en'));
}
