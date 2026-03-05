'use client';

import { useState } from 'react';
import { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';
import businessData from '@/content/data.json';
import { getWhatsAppLink, getTelLink, getMailtoLink } from '@/lib/utils';

interface ContactPageClientProps {
  locale: Locale;
}

export default function ContactPageClient({ locale }: ContactPageClientProps) {
  const t = getTranslations(locale);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = getMailtoLink(
      businessData.business.email,
      `Contact depuis le site - ${formData.name}`,
      formData.message
    );
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const whatsAppLink = getWhatsAppLink(businessData.business.whatsapp);
  const telLink = getTelLink(businessData.business.phone);
  const telLinkSecondary = getTelLink(businessData.business.phoneSecondary);

  return (
    <div className="container-custom section-padding">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold mb-5 tracking-tight">{t.contact.title}</h1>
        <p className="text-xl text-gray-600 font-light">{t.contact.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-semibold mb-8 tracking-tight">{t.contact.info.phone}</h2>
          <div className="space-y-6 mb-10">
            <div className="card-apple p-6">
              <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">{t.contact.info.phone}</p>
              <a href={telLink} className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
                {businessData.business.phone}
              </a>
            </div>
            <div className="card-apple p-6">
              <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">{t.contact.info.phoneSecondary}</p>
              <a href={telLinkSecondary} className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
                {businessData.business.phoneSecondary}
              </a>
            </div>
            <div className="card-apple p-6 bg-blue-50">
              <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">{t.contact.info.whatsapp}</p>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-semibold text-lg"
              >
                {businessData.business.whatsapp}
              </a>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t.contact.info.address}</h2>
            <p className="text-gray-700 text-base leading-relaxed">{businessData.business.addressDetailed}</p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t.contact.info.hours}</h2>
            <p className="text-gray-700 text-base leading-relaxed">{t.contact.info.hoursValue}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t.contact.info.email}</h2>
            <p className="text-gray-700 text-base">{businessData.business.email}</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-8 tracking-tight">{t.contact.form.title}</h2>
          <form onSubmit={handleSubmit} className="card-apple p-10 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.form.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t.contact.form.namePlaceholder}
                className="w-full px-5 py-3 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.form.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t.contact.form.emailPlaceholder}
                className="w-full px-5 py-3 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.form.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder={t.contact.form.messagePlaceholder}
                className="w-full px-5 py-3 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <button type="submit" className="w-full btn-primary">
              {t.contact.form.send}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
