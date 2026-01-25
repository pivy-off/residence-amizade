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

export default function BookingFlow({ locale }: BookingFlowProps) {
  const t = getTranslations(locale);
  const params = useSearchParams();
  const [step, setStep] = useState<Step>(1);
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
  });

  useEffect(() => {
    if (formData.checkin && formData.checkout && formData.guests) {
      setStep(2);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
              }`}>
                {step > s ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-semibold">{s}</span>
                )}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span className={step >= 1 ? 'text-blue-600 font-semibold' : ''}>
            {locale === 'fr' ? 'Dates' : 'Dates'}
          </span>
          <span className={step >= 2 ? 'text-blue-600 font-semibold' : ''}>
            {locale === 'fr' ? 'Chambre' : 'Room'}
          </span>
          <span className={step >= 3 ? 'text-blue-600 font-semibold' : ''}>
            {locale === 'fr' ? 'Détails' : 'Details'}
          </span>
        </div>
      </div>

      {/* Step 1: Select Dates */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="card-apple p-10">
          <h2 className="text-4xl font-light mb-8 tracking-tight">
            {locale === 'fr' ? 'Sélectionnez vos dates' : 'Select your dates'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t.book.form.checkin}
              </label>
              <input
                type="date"
                name="checkin"
                required
                value={formData.checkin}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-5 py-4 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t.book.form.checkout}
              </label>
              <input
                type="date"
                name="checkout"
                required
                value={formData.checkout}
                onChange={handleChange}
                min={formData.checkin || new Date().toISOString().split('T')[0]}
                className="w-full px-5 py-4 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
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
              className="w-full px-5 py-4 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            />
          </div>
          <button type="submit" className="btn-primary w-full text-lg py-4">
            {locale === 'fr' ? 'Continuer' : 'Continue'}
          </button>
        </form>
      )}

      {/* Step 2: Select Room */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="card-apple p-10">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'fr' ? 'Modifier les dates' : 'Change dates'}
            </button>
            <h2 className="text-4xl font-light mb-2 tracking-tight">
              {locale === 'fr' ? 'Choisissez votre chambre' : 'Choose your room'}
            </h2>
            <p className="text-gray-600">
              {locale === 'fr' ? `${formData.checkin} - ${formData.checkout}, ${formData.guests} ${formData.guests === '1' ? 'personne' : 'personnes'}` : `${formData.checkin} - ${formData.checkout}, ${formData.guests} ${formData.guests === '1' ? 'guest' : 'guests'}`}
            </p>
          </div>
          <div className="space-y-4 mb-8">
            {businessData.rooms.map((room) => (
              <label
                key={room.id}
                className={`block p-6 border-2 rounded-apple cursor-pointer transition-all ${
                  formData.roomType === room.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
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
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.roomType === room.id
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {formData.roomType === room.id && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <button type="submit" className="btn-primary w-full text-lg py-4" disabled={!formData.roomType}>
            {locale === 'fr' ? 'Continuer' : 'Continue'}
          </button>
        </form>
      )}

      {/* Step 3: Guest Details */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="card-apple p-10">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'fr' ? 'Modifier la chambre' : 'Change room'}
            </button>
            <h2 className="text-4xl font-light mb-2 tracking-tight">
              {locale === 'fr' ? 'Vos informations' : 'Your information'}
            </h2>
            {selectedRoom && (
              <p className="text-gray-600">
                {selectedRoom.name[locale]} • {formData.checkin} - {formData.checkout}
              </p>
            )}
          </div>
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t.book.form.name}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t.book.form.namePlaceholder}
                className="w-full px-5 py-4 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t.book.form.phone}
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder={t.book.form.phonePlaceholder}
                className="w-full px-5 py-4 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {locale === 'fr' ? 'Email' : 'Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
                className="w-full px-5 py-4 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              />
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="airportTransfer"
                  checked={formData.airportTransfer}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  {locale === 'fr' ? 'Demander un transfert aéroport' : 'Request airport transfer'}
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t.book.form.message}
              </label>
              <textarea
                name="specialRequests"
                rows={4}
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder={t.book.form.messagePlaceholder}
                className="w-full px-5 py-4 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t.book.form.contactMethod}
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-apple border-gray-200 hover:border-blue-300 transition-all">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="whatsapp"
                    checked={formData.contactMethod === 'whatsapp'}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700">{t.book.form.contactWhatsApp}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-apple border-gray-200 hover:border-blue-300 transition-all">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="call"
                    checked={formData.contactMethod === 'call'}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700">{t.book.form.contactCall}</span>
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <button type="submit" className="btn-primary w-full text-lg py-4">
              {locale === 'fr' ? 'Finaliser la réservation' : 'Complete booking'}
            </button>
            <p className="text-sm text-gray-500 text-center">
              {locale === 'fr' ? 'Vous serez redirigé vers WhatsApp ou pourrez nous appeler directement' : 'You will be redirected to WhatsApp or can call us directly'}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
