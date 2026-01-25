export type Locale = 'fr' | 'en';

export interface Room {
  id: string;
  name: {
    fr: string;
    en: string;
  };
  description?: {
    fr: string;
    en: string;
  };
  capacity: number;
  beds?: {
    fr: string;
    en: string;
  };
  size?: {
    fr: string;
    en: string;
  };
  amenities: string[];
  priceFrom: string;
  images: string[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}
