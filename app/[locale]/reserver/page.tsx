import { Suspense } from 'react';
import { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/params';
import BookingFlow from '@/components/BookingFlow';

interface BookPageProps {
  params: { locale?: Locale } | Promise<{ locale?: Locale }> | undefined;
}

function BookingContent({ locale }: { locale: Locale }) {
  return <BookingFlow locale={locale} />;
}

export default async function BookPage({ params }: BookPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container-custom section-padding">
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-3 tracking-tight text-gray-900">
            {t.book.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-light tracking-tight">
            {t.book.subtitle}
          </p>
        </div>
        <Suspense fallback={
          <div className="max-w-2xl mx-auto rounded-3xl bg-white/80 shadow-sm border border-gray-100 p-16 text-center">
            <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <p className="mt-4 text-gray-500 font-medium">Loading...</p>
          </div>
        }>
          <BookingContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
