'use client';

import { useState } from 'react';
import { Locale } from '@/types';

interface NewsletterProps {
  locale: Locale;
}

export default function Newsletter({ locale }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would connect to an email service
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="bg-gray-50 rounded-apple-lg p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-3xl font-light mb-4 tracking-tight">
          {locale === 'fr' ? 'Restez informé' : 'Stay informed'}
        </h3>
        <p className="text-gray-600 mb-8">
          {locale === 'fr' 
            ? 'Recevez nos offres spéciales et actualités directement dans votre boîte mail'
            : 'Receive our special offers and news directly in your inbox'}
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={locale === 'fr' ? 'Votre adresse email' : 'Your email address'}
              required
              className="flex-1 px-5 py-4 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              {locale === 'fr' ? 'S\'abonner' : 'Subscribe'}
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-apple">
            {locale === 'fr' ? 'Merci! Vérifiez votre email.' : 'Thank you! Please check your email.'}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-4">
          {locale === 'fr' ? 'Nous respectons votre vie privée. Désabonnez-vous à tout moment.' : 'We respect your privacy. Unsubscribe at any time.'}
        </p>
      </div>
    </div>
  );
}
