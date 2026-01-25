import { Locale } from '@/types';

interface GuestServicesProps {
  locale: Locale;
}

export default function GuestServices({ locale }: GuestServicesProps) {
  const services = [
    {
      icon: 'luggage',
      title: locale === 'fr' ? 'Service bagages' : 'Luggage service',
      description: locale === 'fr' ? 'Stockage disponible avant/après votre séjour' : 'Storage available before/after your stay',
    },
    {
      icon: 'concierge',
      title: locale === 'fr' ? 'Conciergerie' : 'Concierge',
      description: locale === 'fr' ? 'Assistance pour vos besoins locaux' : 'Assistance for your local needs',
    },
    {
      icon: 'laundry',
      title: locale === 'fr' ? 'Service de blanchisserie' : 'Laundry service',
      description: locale === 'fr' ? 'Sur demande' : 'On request',
    },
    {
      icon: 'parking',
      title: locale === 'fr' ? 'Parking gratuit' : 'Free parking',
      description: locale === 'fr' ? 'Parking sécurisé disponible' : 'Secure parking available',
    },
    {
      icon: 'wifi',
      title: locale === 'fr' ? 'WiFi haute vitesse' : 'High-speed WiFi',
      description: locale === 'fr' ? 'Gratuit dans tout l\'établissement' : 'Free throughout the property',
    },
    {
      icon: 'support',
      title: locale === 'fr' ? 'Support 24/7' : '24/7 Support',
      description: locale === 'fr' ? 'Assistance disponible à tout moment' : 'Assistance available anytime',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <div key={index} className="card-apple p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-apple-lg flex items-center justify-center mb-4">
            {service.icon === 'luggage' && (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
            {service.icon === 'concierge' && (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
            {service.icon === 'laundry' && (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            )}
            {service.icon === 'parking' && (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            )}
            {service.icon === 'wifi' && (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            )}
            {service.icon === 'support' && (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          <h4 className="text-lg font-semibold mb-2 text-gray-900">{service.title}</h4>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
      ))}
    </div>
  );
}
