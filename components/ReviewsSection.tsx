'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';
import ReviewCard from '@/components/ReviewCard';
import businessData from '@/content/data.json';
import type { Review } from '@/types';

interface ReviewsSectionProps {
  locale: Locale;
}

export default function ReviewsSection({ locale }: ReviewsSectionProps) {
  const t = getTranslations(locale);
  const [reviews, setReviews] = useState<Review[]>(businessData.reviews as Review[]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', rating: 5, text: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews.map((r: { id: string; name: string; rating: number; text: string; date: string }) => ({
            id: r.id,
            name: r.name,
            rating: r.rating,
            text: r.text,
            date: r.date,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          rating: Math.max(1, Math.min(5, form.rating)),
          text: form.text.trim(),
          email: form.email.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: 'error', text: t.reviews.formError });
        return;
      }
      setMessage({ type: 'success', text: t.reviews.formSuccess });
      setForm({ name: '', rating: 5, text: '', email: '' });
      setReviews((prev) => [{ id: data.id || String(Date.now()), name: data.name, rating: data.rating, text: data.text, date: data.date }, ...prev]);
    } catch {
      setMessage({ type: 'error', text: t.reviews.formError });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto mb-16 rounded-3xl bg-white shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-light text-gray-900 mb-2">{t.reviews.leaveReview}</h2>
        <p className="text-gray-600 text-sm mb-6">{t.reviews.leaveReviewText}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t.reviews.formName}</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t.reviews.formRating}</label>
              <select
                value={form.rating}
                onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t.reviews.formText}</label>
            <textarea
              required
              rows={4}
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t.reviews.formEmail}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-8 py-3 rounded-2xl bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors"
          >
            {submitting ? (locale === 'fr' ? 'Envoi…' : 'Sending…') : t.reviews.formSubmit}
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <a
            href={businessData.business.mapsUrl || 'https://maps.app.goo.gl/AMYJ1um9xQd4SpVN7'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t.reviews.googleReview}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">{locale === 'fr' ? 'Chargement des avis…' : 'Loading reviews…'}</p>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </>
  );
}
