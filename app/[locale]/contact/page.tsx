import { Locale } from '@/types';
import { getLocaleFromParams } from '@/lib/params';
import ContactPageClient from '@/components/ContactPageClient';

interface ContactPageProps {
  params: { locale?: Locale } | Promise<{ locale?: Locale }> | undefined;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const locale = await getLocaleFromParams(params);
  return <ContactPageClient locale={locale} />;
}
