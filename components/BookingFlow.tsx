'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';
import businessData from '@/content/data.json';
import { getWhatsAppLink, getTelLink } from '@/lib/utils';

interface BookingFlowProps {
  locale: Locale;
}

type Step = 1 | 2 | 3;

function getNights(checkin: string, checkout: string): number {
  if (!checkin || !checkout) return 0;
  const a = new Date(checkin);
  const b = new Date(checkout);
  const diff = (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(diff));
}

/** Valid email: local@domain.tld (e.g. user@gmail.com, name@organization.edu) */
function isValidEmail(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export default function BookingFlow({ locale }: BookingFlowProps) {
  const t = getTranslations(locale);
  const params = useSearchParams();
  const bookingIdFromUrl = params?.get('booking_id');
  const paymentCancel = params?.get('payment') === 'cancel';
  const [step, setStep] = useState<Step>(1);
  const [waveEnabled, setWaveEnabled] = useState(false);
  const [paymentDisabledReason, setPaymentDisabledReason] = useState<string | null>(null);
  const [waveRedirecting, setWaveRedirecting] = useState(false);
  const [waveError, setWaveError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'paid' | 'pending' | 'cancelled' | 'expired' | null>(null);
  const [bookingDetails, setBookingDetails] = useState<{ room_name?: string; total_amount?: number; currency?: string } | null>(null);
  // Available rooms for selected dates (from backend); null = loading/not fetched; [] = none; else list of room ids
  const [availableRoomIds, setAvailableRoomIds] = useState<string[] | null>(null);
  const [formData, setFormData] = useState({
    checkin: params?.get('checkin') || '',
    checkout: params?.get('checkout') || '',
    guests: params?.get('guests') || '1',
    roomType: params?.get('room') || '',
    name: '',
    phone: '',
    email: '',
    specialRequests: '',
    airportTransfer: false,
    contactMethod: 'whatsapp',
    paymentMethod: 'pay_later',
  });

  useEffect(() => {
    if (formData.checkin && formData.checkout && formData.guests) {
      setStep(2);
    }
  }, []);

  // Fetch available rooms for selected dates so paid/pending bookings make rooms disappear from the list
  useEffect(() => {
    if (step !== 2 || !formData.checkin || !formData.checkout) {
      setAvailableRoomIds(null);
      return;
    }
    setAvailableRoomIds(null);
    const guests = parseInt(formData.guests, 10) || 1;
    fetch('/api/bookings/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arrival_date: formData.checkin,
        departure_date: formData.checkout,
        adults: guests,
        children: 0,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        const ids = Array.isArray(d?.available_rooms)
          ? (d.available_rooms as { id?: string }[]).map((r) => r.id).filter(Boolean) as string[]
          : null;
        setAvailableRoomIds(ids);
      })
      .catch(() => setAvailableRoomIds(null));
  }, [step, formData.checkin, formData.checkout, formData.guests]);

  // Clear room selection if selected room is no longer available (e.g. just got paid)
  useEffect(() => {
    if (availableRoomIds !== null && formData.roomType && !availableRoomIds.includes(formData.roomType)) {
      setFormData((prev) => ({ ...prev, roomType: '' }));
    }
  }, [availableRoomIds, formData.roomType]);

  useEffect(() => {
    if (step !== 3) return;
    fetch('/api/paydunya/enabled')
      .then((r) => r.json())
      .then((d) => {
        setWaveEnabled(d?.enabled === true);
        setPaymentDisabledReason(d?.enabled ? null : (d?.reason || null));
      })
      .catch(() => {
        setWaveEnabled(false);
        setPaymentDisabledReason(locale === 'fr' ? 'Impossible de joindre l\'API.' : 'Could not reach API.');
      });
  }, [step, locale]);

  // When returning from PayDunya: call confirm (so backend checks with PayDunya and marks paid even without IPN), then poll status
  useEffect(() => {
    if (!bookingIdFromUrl) {
      setBookingStatus(null);
      setBookingDetails(null);
      return;
    }
    if (paymentCancel) {
      setBookingStatus('cancelled');
      return;
    }
    let cancelled = false;
    const applyStatus = (d: { status?: string; room_name?: string; total_amount?: number; currency?: string } | null) => {
      if (!d) return;
      setBookingStatus((d.status === 'paid' ? 'paid' : d.status === 'pending' ? 'pending' : d.status === 'cancelled' ? 'cancelled' : 'expired') || null);
      setBookingDetails(d ? { room_name: d.room_name, total_amount: d.total_amount, currency: d.currency } : null);
    };
    const fetchStatus = () => {
      fetch(`/api/bookings/${encodeURIComponent(bookingIdFromUrl)}`)
        .then((r) => r.json())
        .then((d) => {
          if (cancelled) return;
          applyStatus(d);
          if (d?.status === 'pending') setTimeout(fetchStatus, 2000);
        })
        .catch(() => { if (!cancelled) setBookingStatus(null); });
    };
    // First call confirm (backend will call PayDunya confirm and mark paid if payment completed)
    fetch(`/api/bookings/${encodeURIComponent(bookingIdFromUrl)}/confirm`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        applyStatus(d);
        if (d?.status === 'pending') setTimeout(fetchStatus, 1500);
        else if (d?.status !== 'paid') fetchStatus();
      })
      .catch(() => fetchStatus());
    return () => { cancelled = true; };
  }, [bookingIdFromUrl, paymentCancel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    if (name === 'email') setEmailError(null);
  };

  const handleEmailBlur = () => {
    const email = formData.email.trim();
    if (!email) {
      setEmailError(null);
      return;
    }
    setEmailError(isValidEmail(email) ? null : (locale === 'fr' ? "Cette adresse email n'est pas valide." : "This email address isn't valid."));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.checkin && formData.checkout && formData.guests) {
      setStep(2);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.roomType) {
      setStep(3);
    }
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod === 'wave') {
      handlePayWithWave();
      return;
    }
    const selectedRoom = businessData.rooms.find(r => r.id === formData.roomType);
    const message = `${locale === 'fr' ? 'Réservation' : 'Booking Request'}

${locale === 'fr' ? 'Nom' : 'Name'}: ${formData.name}
${locale === 'fr' ? 'Téléphone' : 'Phone'}: ${formData.phone}
${locale === 'fr' ? 'Email' : 'Email'}: ${formData.email}
${locale === 'fr' ? 'Date d\'arrivée' : 'Check-in'}: ${formData.checkin}
${locale === 'fr' ? 'Date de départ' : 'Check-out'}: ${formData.checkout}
${locale === 'fr' ? 'Nombre de personnes' : 'Guests'}: ${formData.guests}
${locale === 'fr' ? 'Type de chambre' : 'Room type'}: ${selectedRoom?.name[locale] || formData.roomType}
${formData.airportTransfer ? `${locale === 'fr' ? 'Transfert aéroport: Oui' : 'Airport transfer: Yes'}\n` : ''}
${formData.specialRequests ? `${locale === 'fr' ? 'Demandes spéciales' : 'Special requests'}: ${formData.specialRequests}` : ''}`;

    if (formData.contactMethod === 'whatsapp') {
      window.location.href = getWhatsAppLink(businessData.business.whatsapp, message);
    } else {
      window.location.href = getTelLink(businessData.business.phone);
    }
  };

  const selectedRoom = businessData.rooms.find(r => r.id === formData.roomType);
  const nights = getNights(formData.checkin, formData.checkout);
  const totalAmount = selectedRoom && nights > 0
    ? Number(selectedRoom.priceFrom) * nights
    : 0;

  async function handlePayWithWave() {
    if (!formData.name.trim() || !formData.phone.trim()) {
      setWaveError(locale === 'fr' ? 'Veuillez remplir le nom et le téléphone.' : 'Please fill in name and phone.');
      return;
    }
    const email = formData.email.trim();
    if (!email) {
      setEmailError(locale === 'fr' ? 'Veuillez indiquer une adresse email pour la confirmation.' : 'Please enter an email address for your confirmation.');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError(locale === 'fr' ? "Cette adresse email n'est pas valide." : "This email address isn't valid.");
      return;
    }
    if (totalAmount <= 0 || !formData.roomType || !formData.checkin || !formData.checkout) {
      setWaveError(locale === 'fr' ? 'Dates ou chambre invalides.' : 'Invalid dates or room.');
      return;
    }
    setWaveError(null);
    setEmailError(null);
    setWaveRedirecting(true);
    try {
      const createRes = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: formData.roomType,
          arrival_date: formData.checkin,
          departure_date: formData.checkout,
          adults: parseInt(formData.guests, 10) || 1,
          children: 0,
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim() || '',
          customer_phone: formData.phone.trim(),
          special_requests: formData.specialRequests.trim() || '',
          locale: locale === 'fr' ? 'fr' : 'en',
        }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (createRes.ok && createData.invoice_url) {
        window.location.href = createData.invoice_url;
        return;
      }

      // PayDunya was tried but failed — show its error (don’t fall back to Wave)
      setWaveError(
        createData.error || (locale === 'fr' ? 'Impossible de créer le paiement.' : 'Could not create payment.')
      );
    } catch {
      setWaveError(locale === 'fr' ? 'Erreur réseau. Réessayez.' : 'Network error. Please try again.');
    }
    setWaveRedirecting(false);
  }

  const inputClass = 'w-full px-5 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all duration-200 text-base bg-white/80 border-gray-200';
  const inputErrorClass = 'border-red-300 bg-red-50/50 focus:ring-red-500/40 focus:border-red-400';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Status-driven result: paid = confirmed; pending = confirming; cancelled/failed = message */}
      {bookingIdFromUrl && bookingStatus === 'paid' && (
        <div className="mb-10 p-8 rounded-3xl bg-white shadow-sm border border-green-100 bg-gradient-to-b from-green-50/80 to-white">
          <p className="text-green-800 font-semibold text-lg mb-2">
            {locale === 'fr' ? 'Réservation confirmée' : 'Reservation confirmed'}
          </p>
          <p className="text-green-700/90 text-sm mb-4">
            {locale === 'fr' ? 'Le paiement a bien été reçu. Un email de confirmation vous a été envoyé.' : 'Payment received. A confirmation email has been sent to you.'}
          </p>
          {bookingDetails?.room_name && (
            <p className="text-green-700/90 text-sm mb-5">
              {bookingDetails.room_name} · {bookingDetails.total_amount} {bookingDetails.currency}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <a
              href={getWhatsAppLink(businessData.business.whatsapp, t.common.bookViaWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-600 text-white text-sm font-medium shadow-sm hover:bg-green-700 transition-colors"
            >
              {t.common.whatsapp}
            </a>
            <a href={getTelLink(businessData.business.phone)} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-green-600 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors">
              {t.common.call}
            </a>
          </div>
        </div>
      )}
      {bookingIdFromUrl && bookingStatus === 'pending' && (
        <div className="mb-10 p-8 rounded-3xl bg-white shadow-sm border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white">
          <p className="text-blue-800 font-semibold text-lg">
            {locale === 'fr' ? 'Confirmation du paiement en cours…' : 'Confirming payment…'}
          </p>
          <p className="text-blue-700/90 text-sm mt-2">
            {locale === 'fr' ? 'Cette page se met à jour automatiquement.' : 'This page will update automatically.'}
          </p>
        </div>
      )}
      {(bookingStatus === 'cancelled' || bookingStatus === 'expired' || (bookingIdFromUrl && paymentCancel)) && (
        <div className="mb-10 p-8 rounded-3xl bg-white shadow-sm border border-amber-100 bg-gradient-to-b from-amber-50/80 to-white">
          <p className="text-amber-800 font-semibold text-lg mb-4">
            {paymentCancel || bookingStatus === 'cancelled'
              ? (locale === 'fr' ? 'Paiement annulé.' : 'Payment cancelled.')
              : (locale === 'fr' ? 'Paiement expiré ou échoué.' : 'Payment expired or failed.')}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={getWhatsAppLink(businessData.business.whatsapp, t.common.bookViaWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 text-white text-sm font-medium shadow-sm hover:bg-amber-700 transition-colors"
            >
              {t.common.whatsapp}
            </a>
            <a href={getTelLink(businessData.business.phone)} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-amber-600 text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors">
              {t.common.call}
            </a>
          </div>
        </div>
      )}

      {/* Progress Steps — minimal Apple-style */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${
                step >= s
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}>
                {step > s ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{s}</span>
                )}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full transition-colors ${step > s ? 'bg-gray-900' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs font-medium text-gray-500 tracking-tight">
          <span className={step >= 1 ? 'text-gray-900' : ''}>{locale === 'fr' ? 'Dates' : 'Dates'}</span>
          <span className={step >= 2 ? 'text-gray-900' : ''}>{locale === 'fr' ? 'Chambre' : 'Room'}</span>
          <span className={step >= 3 ? 'text-gray-900' : ''}>{locale === 'fr' ? 'Détails' : 'Details'}</span>
        </div>
      </div>

      {/* Step 1: Select Dates */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="rounded-3xl bg-white shadow-sm border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-light mb-8 tracking-tight text-gray-900">
            {locale === 'fr' ? 'Sélectionnez vos dates' : 'Select your dates'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t.book.form.checkin}
              </label>
              <input
                type="date"
                name="checkin"
                required
                value={formData.checkin}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t.book.form.checkout}
              </label>
              <input
                type="date"
                name="checkout"
                required
                value={formData.checkout}
                onChange={handleChange}
                min={formData.checkin || new Date().toISOString().split('T')[0]}
                className={inputClass}
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t.book.form.guests}
            </label>
            <input
              type="number"
              name="guests"
              required
              min="1"
              max="6"
              value={formData.guests}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <button type="submit" className="w-full py-4 px-6 rounded-2xl bg-gray-900 text-white font-medium text-base shadow-sm hover:bg-gray-800 active:scale-[0.99] transition-all duration-200">
            {locale === 'fr' ? 'Continuer' : 'Continue'}
          </button>
        </form>
      )}

      {/* Step 2: Select Room */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="rounded-3xl bg-white shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'fr' ? 'Modifier les dates' : 'Change dates'}
            </button>
            <h2 className="text-2xl md:text-3xl font-light mb-2 tracking-tight text-gray-900">
              {locale === 'fr' ? 'Choisissez votre chambre' : 'Choose your room'}
            </h2>
            <p className="text-gray-500 text-sm">
              {locale === 'fr' ? `${formData.checkin} – ${formData.checkout}, ${formData.guests} ${formData.guests === '1' ? 'personne' : 'personnes'}` : `${formData.checkin} – ${formData.checkout}, ${formData.guests} ${formData.guests === '1' ? 'guest' : 'guests'}`}
            </p>
          </div>
          <div className="space-y-3 mb-8">
            {availableRoomIds === null && (
              <p className="text-gray-500 py-6 text-center text-sm">{locale === 'fr' ? 'Chargement des chambres disponibles…' : 'Loading available rooms…'}</p>
            )}
            {(availableRoomIds === null ? businessData.rooms : businessData.rooms.filter((r) => availableRoomIds.includes(r.id))).map((room) => (
              <label
                key={room.id}
                className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.roomType === room.id
                    ? 'border-gray-900 bg-gray-50 shadow-sm'
                    : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="roomType"
                  value={room.id}
                  checked={formData.roomType === room.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{room.name[locale]}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {room.capacity} {t.rooms.guests} • {room.amenities.slice(0, 2).join(', ')}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-light text-gray-900">{room.priceFrom} XOF</span>
                      <span className="text-sm text-gray-500">{locale === 'fr' ? 'par nuit' : 'per night'}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    formData.roomType === room.id ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                  }`}>
                    {formData.roomType === room.id && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </label>
            ))}
            {availableRoomIds !== null && availableRoomIds.length === 0 && (
              <p className="text-amber-800 bg-amber-50/80 p-4 rounded-2xl border border-amber-100 text-sm">
                {locale === 'fr' ? 'Aucune chambre disponible pour ces dates. Modifiez les dates ou réessayez plus tard.' : 'No rooms available for these dates. Change dates or try again later.'}
              </p>
            )}
          </div>
          <button type="submit" className="w-full py-4 px-6 rounded-2xl bg-gray-900 text-white font-medium text-base shadow-sm hover:bg-gray-800 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none" disabled={!formData.roomType}>
            {locale === 'fr' ? 'Continuer' : 'Continue'}
          </button>
        </form>
      )}

      {/* Step 3: Guest Details & Payment */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="rounded-3xl bg-white shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'fr' ? 'Modifier la chambre' : 'Change room'}
            </button>
            <h2 className="text-2xl md:text-3xl font-light mb-2 tracking-tight text-gray-900">
              {locale === 'fr' ? 'Vos informations' : 'Your information'}
            </h2>
            {selectedRoom && (
              <p className="text-gray-500 text-sm">
                {selectedRoom.name[locale]} · {formData.checkin} – {formData.checkout}
              </p>
            )}
          </div>
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t.book.form.name}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t.book.form.namePlaceholder}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t.book.form.phone}
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder={t.book.form.phonePlaceholder}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {locale === 'fr' ? 'Email' : 'Email'}
                {formData.paymentMethod === 'wave' && (
                  <span className="text-red-500 ml-1" title={locale === 'fr' ? 'Requis pour la confirmation' : 'Required for confirmation'}>*</span>
                )}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
                className={`${inputClass} ${emailError ? inputErrorClass : ''}`}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                  {emailError}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  name="airportTransfer"
                  checked={formData.airportTransfer}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                />
                <span className="text-sm text-gray-700">
                  {locale === 'fr' ? 'Demander un transfert aéroport' : 'Request airport transfer'}
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t.book.form.message}
              </label>
              <textarea
                name="specialRequests"
                rows={4}
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder={t.book.form.messagePlaceholder}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t.book.form.contactMethod}
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all">
                  <input type="radio" name="contactMethod" value="whatsapp" checked={formData.contactMethod === 'whatsapp'} onChange={handleChange} className="w-4 h-4 text-gray-900" />
                  <span className="text-gray-800 text-sm">{t.book.form.contactWhatsApp}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all">
                  <input type="radio" name="contactMethod" value="call" checked={formData.contactMethod === 'call'} onChange={handleChange} className="w-4 h-4 text-gray-900" />
                  <span className="text-gray-800 text-sm">{t.book.form.contactCall}</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t.book.form.paymentMethod}
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all">
                  <input type="radio" name="paymentMethod" value="pay_later" checked={formData.paymentMethod === 'pay_later'} onChange={handleChange} className="w-4 h-4 text-gray-900" />
                  <span className="text-gray-800 text-sm">{t.book.form.payLater}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all">
                  <input type="radio" name="paymentMethod" value="wave" checked={formData.paymentMethod === 'wave'} onChange={handleChange} className="w-4 h-4 text-gray-900" />
                  <span className="text-gray-800 text-sm">{t.book.form.payWithWave}</span>
                </label>
                {!waveEnabled && paymentDisabledReason && (
                  <p className="text-sm text-amber-800 bg-amber-50/80 border border-amber-100 rounded-2xl px-4 py-3 mt-2">
                    {locale === 'fr' ? 'Paiement en ligne désactivé : ' : 'Online payment disabled: '}
                    {paymentDisabledReason}
                  </p>
                )}
              </div>
              {formData.paymentMethod === 'wave' && selectedRoom && nights > 0 && (
                <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t.book.form.amountSummary}</p>
                  <p className="text-gray-800 text-sm">
                    {selectedRoom.priceFrom} XOF / {locale === 'fr' ? 'nuit' : 'night'} × {nights} {t.book.form.nights} = <strong>{totalAmount.toLocaleString('fr-FR')} {t.book.form.totalXOF}</strong>
                  </p>
                </div>
              )}
            </div>
            {waveError && (
              <p className="text-sm text-red-600 bg-red-50/80 border border-red-100 p-3 rounded-2xl" role="alert">{waveError}</p>
            )}
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              disabled={waveRedirecting}
              className="w-full py-4 px-6 rounded-2xl bg-gray-900 text-white font-medium text-base shadow-sm hover:bg-gray-800 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
            >
              {waveRedirecting
                ? t.book.form.waveRedirecting
                : formData.paymentMethod === 'wave'
                  ? (locale === 'fr' ? 'Payer maintenant' : 'Pay now')
                  : (locale === 'fr' ? 'Finaliser la réservation' : 'Complete booking')}
            </button>
            {formData.paymentMethod === 'pay_later' && (
              <p className="text-xs text-gray-500 text-center">
                {locale === 'fr' ? 'Vous serez redirigé vers WhatsApp ou pourrez nous appeler directement.' : 'You will be redirected to WhatsApp or can call us directly.'}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
