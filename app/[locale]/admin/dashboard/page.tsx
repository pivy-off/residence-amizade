'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@/types';

const STORAGE_KEY = 'admin_dashboard_code';

type DashboardData = {
  bookings: Array<{
    id: string;
    status: string;
    arrival_date: string;
    departure_date: string;
    checkout_date: string;
    room_id: string;
    room_name: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    adults: number;
    children: number;
    total_amount: number;
    currency: string;
    special_requests: string;
    created_at: string | null;
    paid_at: string | null;
    email_sent_at: string | null;
  }>;
  rooms: Array<{ id: string; name: string; price_per_night: number }>;
  availability_6m: {
    start_date: string;
    end_date: string;
    rooms: Array<{
      room_id: string;
      room_name: string;
      booked_ranges: Array<{ arrival_date: string; departure_date: string; booking_id: string; status: string }>;
    }>;
  };
  reviews: Array<{
    id: string;
    name: string;
    rating: number;
    text: string;
    date: string;
    email: string;
    created_at: string | null;
  }>;
};

export default function AdminDashboardPage({ params }: { params: { locale?: Locale } }) {
  const locale: Locale = (params.locale as Locale) || 'fr';
  const [adminCode, setAdminCode] = useState('');
  const [storedCode, setStoredCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setStoredCode(saved);
    }
  }, []);

  useEffect(() => {
    if (!storedCode || data) return;
    loadDashboard(storedCode);
  }, [storedCode]);

  const loadDashboard = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'X-Admin-Secret': code.trim() },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || (locale === 'fr' ? 'Code incorrect.' : 'Invalid code.'));
        if (res.status === 401 && typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
        setStoredCode(null);
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, code.trim());
      setStoredCode(code.trim());
      setData(json);
    } catch {
      setError(locale === 'fr' ? 'Service indisponible.' : 'Service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode.trim()) loadDashboard(adminCode.trim());
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStoredCode(null);
    setData(null);
    setAdminCode('');
  };

  const t = locale === 'fr' ? {
    title: 'Tableau de bord admin',
    enterCode: 'Code administrateur',
    submit: 'Accéder',
    logout: 'Quitter',
    bookings: 'Réservations',
    clients: 'Clients',
    checkout: 'Départ',
    availability: 'Disponibilité (6 mois)',
    reviews: 'Avis',
    room: 'Chambre',
    arrival: 'Arrivée',
    departure: 'Départ',
    customer: 'Client',
    email: 'Email',
    phone: 'Téléphone',
    amount: 'Montant',
    status: 'Statut',
    addOffline: 'Ajouter réservation hors ligne',
    noBookings: 'Aucune réservation',
    noReviews: 'Aucun avis',
    bookedRanges: 'Réservé',
    from: 'du',
    to: 'au',
    summary: 'Résumé',
    totalBookings: 'Réservations totales',
    paidBookings: 'Payées',
    upcomingCheckouts: 'Départs à venir (7 j)',
    roomsList: 'Chambres (toutes)',
    pricePerNight: 'Prix/nuit',
  } : {
    title: 'Admin dashboard',
    enterCode: 'Admin code',
    submit: 'Access',
    logout: 'Log out',
    bookings: 'Bookings',
    clients: 'Clients',
    checkout: 'Checkout',
    availability: 'Availability (6 months)',
    reviews: 'Reviews',
    room: 'Room',
    arrival: 'Arrival',
    departure: 'Departure',
    customer: 'Customer',
    email: 'Email',
    phone: 'Phone',
    amount: 'Amount',
    status: 'Status',
    addOffline: 'Add offline booking',
    noBookings: 'No bookings',
    noReviews: 'No reviews',
    bookedRanges: 'Booked',
    from: 'from',
    to: 'to',
    summary: 'Summary',
    totalBookings: 'Total bookings',
    paidBookings: 'Paid',
    upcomingCheckouts: 'Upcoming checkouts (7d)',
    roomsList: 'Rooms (all)',
    pricePerNight: 'Price/night',
  };

  if (!data && !storedCode) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-light text-gray-900 mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 mb-6">
            {locale === 'fr' ? 'Entrez le code pour voir toutes les données.' : 'Enter the code to view all data.'}
          </p>
          <input
            type="password"
            value={adminCode}
            onChange={(e) => { setAdminCode(e.target.value); setError(null); }}
            placeholder={t.enterCode}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4"
            autoFocus
          />
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-60">
            {loading ? (locale === 'fr' ? 'Chargement…' : 'Loading…') : t.submit}
          </button>
        </form>
      </div>
    );
  }

  if (storedCode && !data) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-gray-500">{loading ? (locale === 'fr' ? 'Chargement…' : 'Loading…') : (error || '…')}</div>
      </div>
    );
  }

  if (!data) return null;

  const today = new Date().toISOString().slice(0, 10);
  const in7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const paidCount = data.bookings.filter((b) => b.status === 'paid').length;
  const upcomingCheckouts = data.bookings.filter((b) => b.status === 'paid' && b.departure_date >= today && b.departure_date <= in7);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="container-custom py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-light text-gray-900">{t.title}</h1>
          <div className="flex items-center gap-3">
            <Link
              href={locale === 'fr' ? '/fr/admin/bookings' : '/en/admin/bookings'}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {t.addOffline}
            </Link>
            <button type="button" onClick={logout} className="text-sm font-medium text-gray-500 hover:text-gray-800">
              {t.logout}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.totalBookings}</p>
            <p className="text-2xl font-light text-gray-900 mt-1">{data.bookings.length}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.paidBookings}</p>
            <p className="text-2xl font-light text-gray-900 mt-1">{paidCount}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.upcomingCheckouts}</p>
            <p className="text-2xl font-light text-gray-900 mt-1">{upcomingCheckouts.length}</p>
          </div>
        </div>

        {/* Rooms list - all rooms with prices */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-5 border-b border-gray-100">{t.roomsList}</h2>
          <div className="p-5">
            {data.rooms && data.rooms.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.rooms.map((r) => (
                  <li key={r.id} className="rounded-xl border border-gray-100 p-4 bg-gray-50/50">
                    <p className="font-medium text-gray-900">{r.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{r.id}</p>
                    <p className="text-sm font-medium text-gray-700 mt-2">{r.price_per_night?.toLocaleString?.() ?? r.price_per_night} XOF <span className="text-gray-500 font-normal">/ {locale === 'fr' ? 'nuit' : 'night'}</span></p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{locale === 'fr' ? 'Aucune chambre en base. Vérifiez le backend (seed des chambres).' : 'No rooms in database. Check backend (room seed).'}</p>
            )}
          </div>
        </section>

        {/* Bookings & clients */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-5 border-b border-gray-100">{t.bookings} / {t.clients}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 font-medium">
                  <th className="p-3">{t.customer}</th>
                  <th className="p-3">{t.email}</th>
                  <th className="p-3">{t.phone}</th>
                  <th className="p-3">{t.room}</th>
                  <th className="p-3">{t.arrival}</th>
                  <th className="p-3">{t.checkout}</th>
                  <th className="p-3">{t.status}</th>
                  <th className="p-3">{t.amount}</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-gray-500 text-center">{t.noBookings}</td></tr>
                ) : (
                  data.bookings.map((b) => (
                    <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3 font-medium text-gray-900">{b.customer_name}</td>
                      <td className="p-3 text-gray-600">{b.customer_email || '—'}</td>
                      <td className="p-3 text-gray-600">{b.customer_phone || '—'}</td>
                      <td className="p-3">{b.room_name}</td>
                      <td className="p-3">{b.arrival_date}</td>
                      <td className="p-3">{b.departure_date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          b.status === 'paid' ? 'bg-green-100 text-green-800' :
                          b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3">{b.total_amount} {b.currency}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Availability next 6 months */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-5 border-b border-gray-100">
            {t.availability} {data.availability_6m?.start_date && data.availability_6m?.end_date ? `(${data.availability_6m.start_date} → ${data.availability_6m.end_date})` : ''}
          </h2>
          <div className="p-5 space-y-6">
            {(data.availability_6m?.rooms && data.availability_6m.rooms.length > 0 ? data.availability_6m.rooms : data.rooms?.map((r) => ({ room_id: r.id, room_name: r.name, booked_ranges: [] })) ?? []).map((room: { room_id: string; room_name: string; booked_ranges: Array<{ arrival_date: string; departure_date: string; status: string }> }) => (
              <div key={room.room_id}>
                <h3 className="font-medium text-gray-900 mb-2">{room.room_name}</h3>
                {!room.booked_ranges || room.booked_ranges.length === 0 ? (
                  <p className="text-sm text-green-600">{locale === 'fr' ? 'Disponible sur toute la période (aucune réservation).' : 'Available for the whole period (no bookings).'}</p>
                ) : (
                  <ul className="text-sm space-y-1">
                    {room.booked_ranges.map((r, i) => (
                      <li key={i} className="text-gray-700">
                        {t.bookedRanges}: {r.arrival_date} → {r.departure_date}
                        <span className="ml-2 text-gray-500">({r.status})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-5 border-b border-gray-100">{t.reviews}</h2>
          <div className="p-5">
            {data.reviews.length === 0 ? (
              <p className="text-gray-500">{t.noReviews}</p>
            ) : (
              <ul className="space-y-4">
                {data.reviews.map((r) => (
                  <li key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{r.name}</span>
                      <span className="text-amber-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="text-xs text-gray-500">{r.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{r.text}</p>
                    {r.email && <p className="text-xs text-gray-500 mt-1">{r.email}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
