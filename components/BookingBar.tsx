'use client';

import { useState } from 'react';
import { Locale } from '@/types';
import { getTranslations, getFullLocalizedPath } from '@/lib/i18n';
import businessData from '@/content/data.json';
import Link from 'next/link';

interface BookingBarProps {
  locale: Locale;
}

export default function BookingBar({ locale }: BookingBarProps) {
  const t = getTranslations(locale);
  const [formData, setFormData] = useState({
    checkin: '',
    checkout: '',
    guests: '1',
    roomType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkin: formData.checkin,
      checkout: formData.checkout,
      guests: formData.guests,
      room: formData.roomType,
    });
    window.location.href = `${getFullLocalizedPath('/reserver', locale)}?${params.toString()}`;
  };

  return (
    <div className="bg-white rounded-apple-lg shadow-apple-lg p-6 md:p-8 max-w-6xl mx-auto -mt-16 md:-mt-24 relative z-20">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.book.form.checkin}
          </label>
          <input
            type="date"
            name="checkin"
            required
            value={formData.checkin}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.book.form.checkout}
          </label>
          <input
            type="date"
            name="checkout"
            required
            value={formData.checkout}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.book.form.guests}
          </label>
          <input
            type="number"
            name="guests"
            required
            min="1"
            value={formData.guests}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.book.form.roomType}
          </label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">{locale === 'fr' ? 'Tous' : 'All'}</option>
            {businessData.rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name[locale]}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-4 mt-2">
          <button type="submit" className="w-full btn-primary text-lg py-4">
            {locale === 'fr' ? 'Vérifier la disponibilité' : 'Check Availability'}
          </button>
        </div>
      </form>
    </div>
  );
}
