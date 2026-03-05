import { Locale } from '@/types';

export const locales: Locale[] = ['fr', 'en'];
export const defaultLocale: Locale = 'fr';

export const translations = {
  fr: {
    nav: {
      home: 'Accueil',
      rooms: 'Chambres',
      gallery: 'Galerie',
      location: 'Localisation',
      reviews: 'Avis',
      book: 'Réserver',
      contact: 'Contact',
    },
    common: {
      whatsapp: 'WhatsApp',
      call: 'Appeler',
      bookViaWhatsApp: 'Réserver via WhatsApp',
      reservationRequest: 'Demande de réservation',
      readMore: 'Lire plus',
      learnMore: 'En savoir plus',
      back: 'Retour',
      submit: 'Envoyer',
      loading: 'Chargement...',
    },
    home: {
      hero: {
        title: 'Résidence Amizade',
        subtitle: 'Votre havre de paix à Ziguinchor',
        description: 'Un séjour calme, propre et accueillant près de l\'hôpital régional',
      },
      proof: {
        cleanliness: {
          title: 'Propreté',
          description: 'Chambres et espaces communs impeccables',
        },
        calm: {
          title: 'Calme et jardin',
          description: 'Environnement paisible avec jardin verdoyant',
        },
        welcome: {
          title: 'Accueil chaleureux',
          description: 'Personnel souriant et à l\'écoute',
        },
      },
      highlights: {
        title: 'Pourquoi choisir Résidence Amizade',
        nearHospital: 'Proche hôpital régional',
        wifi: 'WiFi gratuit',
        parking: 'Parking disponible',
        restaurant: 'Restaurant sur commande',
        english: 'Personnel anglophone',
        value: 'Excellent rapport qualité-prix',
      },
      reviews: {
        title: 'Ce que disent nos clients',
        viewAll: 'Voir tous les avis',
      },
      location: {
        title: 'Localisation',
        address: 'Ziguinchor, Sénégal',
        nearHospital: 'À proximité de l\'hôpital régional',
        viewMap: 'Voir sur la carte',
      },
      cta: {
        title: 'Prêt pour votre séjour?',
        subtitle: 'Réservez dès maintenant via WhatsApp ou remplissez notre formulaire',
      },
    },
    rooms: {
      title: 'Nos Chambres',
      subtitle: 'Des espaces confortables pour tous vos besoins',
      fromPrice: 'À partir de',
      confirmPrice: 'Tarifs à confirmer',
      capacity: 'Capacité',
      guests: 'personnes',
      amenities: 'Équipements',
      bookNow: 'Réserver maintenant',
      faq: {
        title: 'Politique et informations pratiques',
        checkin: {
          q: 'Heure d\'arrivée',
          a: 'À partir de 14h00',
        },
        checkout: {
          q: 'Heure de départ',
          a: 'Avant 12h00',
        },
        breakfast: {
          q: 'Petit-déjeuner inclus?',
          a: 'Sur demande, avec supplément',
        },
        cancellation: {
          q: 'Politique d\'annulation',
          a: 'Annulation gratuite jusqu\'à 48h avant l\'arrivée',
        },
        deposit: {
          q: 'Caution requise?',
          a: 'Une caution peut être demandée à l\'arrivée',
        },
        payment: {
          q: 'Modes de paiement',
          a: 'Espèces uniquement. Paiement à l\'arrivée ou départ',
        },
      },
    },
    gallery: {
      title: 'Galerie',
      subtitle: 'Découvrez notre résidence',
    },
    location: {
      title: 'Localisation',
      subtitle: 'Trouvez-nous facilement',
      address: 'Ziguinchor, Sénégal',
      nearHospital: 'À proximité de l\'hôpital régional',
      directions: 'Itinéraires',
      directionsText: 'La résidence est située à Ziguinchor, à proximité de l\'hôpital régional. Accessible facilement en voiture ou en transport en commun.',
      contact: 'Besoin d\'aide pour nous trouver?',
      contactUs: 'Contactez-nous',
    },
    reviews: {
      title: 'Avis Clients',
      subtitle: 'Votre satisfaction est notre priorité',
      leaveReview: 'Laisser un avis',
      leaveReviewText: 'Partagez votre expérience. Votre avis nous aide à améliorer nos services.',
      googleReview: 'Voir sur Google',
      formName: 'Votre nom',
      formRating: 'Note (1-5)',
      formText: 'Votre avis',
      formEmail: 'Email (optionnel)',
      formSubmit: 'Publier l\'avis',
      formSuccess: 'Merci ! Votre avis a été publié.',
      formError: 'Impossible d\'envoyer l\'avis. Réessayez plus tard.',
    },
    book: {
      title: 'Réserver',
      subtitle: 'Faites votre demande de réservation',
      form: {
        name: 'Nom complet',
        namePlaceholder: 'Votre nom',
        phone: 'Téléphone / WhatsApp',
        phonePlaceholder: '+221 XX XXX XX XX',
        checkin: 'Date d\'arrivée',
        checkout: 'Date de départ',
        guests: 'Nombre de personnes',
        roomType: 'Type de chambre',
        message: 'Message (optionnel)',
        messagePlaceholder: 'Demandes spéciales, informations supplémentaires...',
        contactMethod: 'Méthode de contact préférée',
        contactWhatsApp: 'WhatsApp',
        contactCall: 'Appel téléphonique',
        paymentMethod: 'Paiement',
        payLater: 'Payer plus tard (confirmer par WhatsApp ou appel)',
        payWithWave: 'Payer maintenant (Wave, Orange Money, carte)',
        amountSummary: 'Montant à payer',
        nights: 'nuit(s)',
        totalXOF: 'Total XOF',
        waveRedirecting: 'Redirection vers Wave...',
      },
      confirmation: {
        title: 'Demande envoyée',
        message: 'Votre demande de réservation a été préparée. Cliquez sur les boutons ci-dessous pour finaliser via WhatsApp ou par téléphone.',
        whatsAppMessage: 'Envoyer via WhatsApp',
        callUs: 'Nous appeler',
        backToSite: 'Retour au site',
      },
      wave: {
        success: 'Paiement Wave reçu. Envoyez-nous vos coordonnées via WhatsApp pour confirmer la réservation.',
        error: 'Le paiement Wave n\'a pas abouti. Vous pouvez réessayer ou nous contacter par WhatsApp.',
        retry: 'Réessayer avec Wave',
      },
    },
    contact: {
      title: 'Contact',
      subtitle: 'Nous sommes là pour vous aider',
      info: {
        phone: 'Téléphone principal',
        phoneSecondary: 'Téléphone secondaire',
        whatsapp: 'WhatsApp',
        address: 'Adresse',
        addressValue: 'Ziguinchor, Sénégal',
        hours: 'Horaires',
        hoursValue: 'Réception: 24h/24, 7j/7',
        email: 'Email',
      },
      form: {
        title: 'Envoyez-nous un message',
        name: 'Nom',
        namePlaceholder: 'Votre nom',
        email: 'Email',
        emailPlaceholder: 'votre@email.com',
        message: 'Message',
        messagePlaceholder: 'Votre message...',
        send: 'Envoyer',
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      rooms: 'Rooms',
      gallery: 'Gallery',
      location: 'Location',
      reviews: 'Reviews',
      book: 'Book',
      contact: 'Contact',
    },
    common: {
      whatsapp: 'WhatsApp',
      call: 'Call',
      bookViaWhatsApp: 'Book via WhatsApp',
      reservationRequest: 'Reservation Request',
      readMore: 'Read more',
      learnMore: 'Learn more',
      back: 'Back',
      submit: 'Submit',
      loading: 'Loading...',
    },
    home: {
      hero: {
        title: 'Résidence Amizade',
        subtitle: 'Your haven of peace in Ziguinchor',
        description: 'A calm, clean, and welcoming stay near the regional hospital',
      },
      proof: {
        cleanliness: {
          title: 'Cleanliness',
          description: 'Immaculate rooms and common areas',
        },
        calm: {
          title: 'Calm and garden',
          description: 'Peaceful environment with lush garden',
        },
        welcome: {
          title: 'Warm welcome',
          description: 'Smiling and attentive staff',
        },
      },
      highlights: {
        title: 'Why choose Résidence Amizade',
        nearHospital: 'Near regional hospital',
        wifi: 'Free WiFi',
        parking: 'Parking available',
        restaurant: 'Restaurant on request',
        english: 'English speaking staff',
        value: 'Excellent value for money',
      },
      reviews: {
        title: 'What our clients say',
        viewAll: 'View all reviews',
      },
      location: {
        title: 'Location',
        address: 'Ziguinchor, Senegal',
        nearHospital: 'Near the regional hospital',
        viewMap: 'View on map',
      },
      cta: {
        title: 'Ready for your stay?',
        subtitle: 'Book now via WhatsApp or fill out our form',
      },
    },
    rooms: {
      title: 'Our Rooms',
      subtitle: 'Comfortable spaces for all your needs',
      fromPrice: 'From',
      confirmPrice: 'Rates to be confirmed',
      capacity: 'Capacity',
      guests: 'guests',
      amenities: 'Amenities',
      bookNow: 'Book now',
      faq: {
        title: 'Policies and practical information',
        checkin: {
          q: 'Check-in time',
          a: 'From 2:00 PM',
        },
        checkout: {
          q: 'Check-out time',
          a: 'Before 12:00 PM',
        },
        breakfast: {
          q: 'Breakfast included?',
          a: 'On request, with supplement',
        },
        cancellation: {
          q: 'Cancellation policy',
          a: 'Free cancellation up to 48 hours before arrival',
        },
        deposit: {
          q: 'Deposit required?',
          a: 'A deposit may be required upon arrival',
        },
        payment: {
          q: 'Payment methods',
          a: 'Cash only. Payment upon arrival or departure',
        },
      },
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Discover our residence',
    },
    location: {
      title: 'Location',
      subtitle: 'Find us easily',
      address: 'Ziguinchor, Senegal',
      nearHospital: 'Near the regional hospital',
      directions: 'Directions',
      directionsText: 'The residence is located in Ziguinchor, near the regional hospital. Easily accessible by car or public transport.',
      contact: 'Need help finding us?',
      contactUs: 'Contact us',
    },
    reviews: {
      title: 'Client Reviews',
      subtitle: 'Your satisfaction is our priority',
      leaveReview: 'Leave a review',
      leaveReviewText: 'Share your experience. Your review helps us improve our services.',
      googleReview: 'View on Google',
      formName: 'Your name',
      formRating: 'Rating (1-5)',
      formText: 'Your review',
      formEmail: 'Email (optional)',
      formSubmit: 'Submit review',
      formSuccess: 'Thank you! Your review has been published.',
      formError: 'Could not submit review. Please try again later.',
    },
    book: {
      title: 'Book',
      subtitle: 'Make your reservation request',
      form: {
        name: 'Full name',
        namePlaceholder: 'Your name',
        phone: 'Phone / WhatsApp',
        phonePlaceholder: '+221 XX XXX XX XX',
        checkin: 'Check-in date',
        checkout: 'Check-out date',
        guests: 'Number of guests',
        roomType: 'Room type',
        message: 'Message (optional)',
        messagePlaceholder: 'Special requests, additional information...',
        contactMethod: 'Preferred contact method',
        contactWhatsApp: 'WhatsApp',
        contactCall: 'Phone call',
        paymentMethod: 'Payment',
        payLater: 'Pay later (confirm via WhatsApp or call)',
        payWithWave: 'Pay now (Wave, Orange Money, card)',
        amountSummary: 'Amount to pay',
        nights: 'night(s)',
        totalXOF: 'Total XOF',
        waveRedirecting: 'Redirecting to Wave...',
      },
      confirmation: {
        title: 'Request sent',
        message: 'Your reservation request has been prepared. Click on the buttons below to finalize via WhatsApp or by phone.',
        whatsAppMessage: 'Send via WhatsApp',
        callUs: 'Call us',
        backToSite: 'Back to site',
      },
      wave: {
        success: 'Wave payment received. Send us your details via WhatsApp to confirm the reservation.',
        error: 'Wave payment did not complete. You can try again or contact us via WhatsApp.',
        retry: 'Retry with Wave',
      },
    },
    contact: {
      title: 'Contact',
      subtitle: 'We are here to help you',
      info: {
        phone: 'Main phone',
        phoneSecondary: 'Secondary phone',
        whatsapp: 'WhatsApp',
        address: 'Address',
        addressValue: 'Ziguinchor, Senegal',
        hours: 'Hours',
        hoursValue: 'Reception: 24/7',
        email: 'Email',
      },
      form: {
        title: 'Send us a message',
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        message: 'Message',
        messagePlaceholder: 'Your message...',
        send: 'Send',
      },
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const pathMap: Record<string, { fr: string; en: string }> = {
    '/': { fr: '/', en: '/en' },
    '/chambres': { fr: '/chambres', en: '/rooms' },
    '/rooms': { fr: '/chambres', en: '/rooms' },
    '/galerie': { fr: '/galerie', en: '/gallery' },
    '/gallery': { fr: '/galerie', en: '/gallery' },
    '/localisation': { fr: '/localisation', en: '/location' },
    '/location': { fr: '/localisation', en: '/location' },
    '/avis': { fr: '/avis', en: '/reviews' },
    '/reviews': { fr: '/avis', en: '/reviews' },
    '/reserver': { fr: '/reserver', en: '/book' },
    '/book': { fr: '/reserver', en: '/book' },
    '/contact': { fr: '/contact', en: '/contact' },
  };

  const route = pathMap[path] || { fr: path, en: path };
  return route[locale];
}

export function getAlternatePath(path: string, locale: Locale): string {
  return getLocalizedPath(path, locale === 'fr' ? 'en' : 'fr');
}

export function getFullLocalizedPath(path: string, locale: Locale): string {
  const localizedPath = getLocalizedPath(path, locale);
  if (localizedPath === '/') {
    return `/${locale}`;
  }
  // If path already starts with locale, return as is
  if (localizedPath.startsWith(`/${locale}`)) {
    return localizedPath;
  }
  return `/${locale}${localizedPath}`;
}
