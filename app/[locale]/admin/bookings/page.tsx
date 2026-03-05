 'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/types';
import businessData from '@/content/data.json';

interface AdminBookingsPageProps {
  params: { locale?: Locale };
}

const ROOMS = businessData.rooms;

export default function AdminBookingsPage({ params }: AdminBookingsPageProps) {
  const locale: Locale = (params.locale as Locale) || 'fr';
  const [form, setForm] = useState({
    adminCode: '',
    room_id: ROOMS[0]?.id || '',
    arrival_date: '',
    departure_date: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    total_amount: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'adminCode') setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/bookings/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: form.room_id,
          arrival_date: form.arrival_date,
          departure_date: form.departure_date,
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          total_amount: form.total_amount ? Number(form.total_amount) : undefined,
          notes: form.notes,
          adminCode: form.adminCode,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || (locale === 'fr' ? 'Erreur lors de la création de la réservation.' : 'Error creating booking.'));
      } else {
        setResult(
          locale === 'fr'
            ? `Réservation ajoutée (id: ${data.booking_id || '—'})`
            : `Booking added (id: ${data.booking_id || '—'})`
        );
        setForm((prev) => ({
          ...prev,
          arrival_date: '',
          departure_date: '',
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          total_amount: '',
          notes: '',
        }));
      }
    } catch {
      setError(locale === 'fr' ? 'Service indisponible.' : 'Service unavailable.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="container-custom section-padding">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <Link href={locale === 'fr' ? '/fr/admin/dashboard' : '/en/admin/dashboard'} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                {locale === 'fr' ? '← Tableau de bord' : '← Dashboard'}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
              {locale === 'fr' ? 'Réservations hors ligne' : 'Offline bookings'}
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              {locale === 'fr'
                ? 'Ajoutez ici les réservations confirmées par WhatsApp ou téléphone pour mettre à jour la disponibilité.'
                : 'Add bookings confirmed by WhatsApp or phone so availability stays correct.'}
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white shadow-sm border border-gray-100 p-6 md:p-8 space-y-5"
          >
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {locale === 'fr' ? 'Code administrateur' : 'Admin code'} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="adminCode"
                value={form.adminCode}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                placeholder={locale === 'fr' ? 'Code partagé avec la direction' : 'Code shared with management'}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {locale === 'fr' ? 'Chambre' : 'Room'}
                </label>
                <select
                  name="room_id"
                  value={form.room_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                >
                  {ROOMS.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name[locale]} ({room.priceFrom} XOF)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {locale === 'fr' ? 'Montant total (optionnel)' : 'Total amount (optional)'}
                </label>
                <input
                  type="number"
                  name="total_amount"
                  min={0}
                  value={form.total_amount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                  placeholder="XOF"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {locale === 'fr' ? 'Arrivée' : 'Arrival'}
                </label>
                <input
                  type="date"
                  name="arrival_date"
                  value={form.arrival_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {locale === 'fr' ? 'Départ' : 'Departure'}
                </label>
                <input
                  type="date"
                  name="departure_date"
                  value={form.departure_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {locale === 'fr' ? 'Nom du client' : 'Guest name'}
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                  placeholder={locale === 'fr' ? 'Nom complet' : 'Full name'}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {locale === 'fr' ? 'Téléphone' : 'Phone'}
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={form.customer_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                  placeholder="+221..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={form.customer_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {locale === 'fr' ? 'Notes (optionnel)' : 'Notes (optional)'}
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50/80 border border-red-100 rounded-2xl px-4 py-3" role="alert">
                {error}
              </p>
            )}
            {result && (
              <p className="text-sm text-green-700 bg-green-50/80 border border-green-100 rounded-2xl px-4 py-3">
                {result}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gray-900 text-white text-sm font-medium shadow-sm hover:bg-gray-800 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting
                  ? locale === 'fr' ? 'Enregistrement…' : 'Saving…'
                  : locale === 'fr' ? 'Ajouter la réservation' : 'Add booking'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center">
            {locale === 'fr'
              ? 'Cette page est réservée au personnel. Gardez le code administrateur confidentiel.'
              : 'This page is for staff only. Keep the admin code confidential.'}
          </p>
        </div>
      </div>
    </div>
  );
}

