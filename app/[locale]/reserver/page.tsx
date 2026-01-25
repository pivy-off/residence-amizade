import { Suspense } from 'react';
import { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';
import BookingFlow from '@/components/BookingFlow';

interface BookPageProps {
  params: { locale: Locale };
}

function BookingContent({ locale }: { locale: Locale }) {
  return <BookingFlow locale={locale} />;
}

export default function BookPage({ params }: BookPageProps) {
  const { locale } = params;
  const t = getTranslations(locale);

  return (
    <div className="container-custom section-padding">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-tight">{t.book.title}</h1>
        <p className="text-xl text-gray-600 font-light">{t.book.subtitle}</p>
      </div>
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <BookingContent locale={locale} />
      </Suspense>
    </div>
  );
}
