# Résidence Amizade Website

Production-ready website for Résidence Amizade hotel in Ziguinchor, Senegal.

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Bilingual support (French/English)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── [locale]/          # Locale-based routing (fr/en)
│   │   ├── page.tsx       # Homepage
│   │   ├── chambres/      # Rooms (French)
│   │   ├── rooms/         # Rooms (English redirect)
│   │   ├── galerie/       # Gallery (French)
│   │   ├── gallery/       # Gallery (English redirect)
│   │   ├── localisation/  # Location (French)
│   │   ├── location/      # Location (English redirect)
│   │   ├── avis/          # Reviews (French)
│   │   ├── reviews/       # Reviews (English redirect)
│   │   ├── reserver/      # Book (French)
│   │   ├── book/          # Book (English redirect)
│   │   └── contact/       # Contact
│   ├── layout.tsx         # Root layout with structured data
│   ├── sitemap.ts         # Sitemap generation
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── Header.tsx         # Sticky header with navigation
│   ├── MobileBottomBar.tsx # Mobile WhatsApp/Call buttons
│   ├── RoomCard.tsx       # Room display card
│   └── ReviewCard.tsx     # Review display card
├── content/
│   └── data.json          # Content source (rooms, reviews, business info)
├── lib/
│   ├── i18n.ts            # Translation dictionary and utilities
│   ├── metadata.ts        # SEO metadata generation
│   ├── utils.ts           # Utility functions (WhatsApp links, etc.)
│   └── get-locale.ts      # Locale detection helpers
├── public/
│   └── images/            # Image placeholders
└── types/
    └── index.ts           # TypeScript type definitions
```

## Editing Content

### Room Data

Edit `content/data.json` to update rooms, reviews, and business information.

**Room structure:**
```json
{
  "id": "room-id",
  "name": {
    "fr": "French room name",
    "en": "English room name"
  },
  "capacity": 2,
  "amenities": ["Amenity 1", "Amenity 2"],
  "priceFrom": "20000",
  "images": ["/images/path/to/image.jpg"]
}
```

**Review structure:**
```json
{
  "id": "review-id",
  "name": "Guest Name",
  "rating": 5,
  "text": "Review text",
  "date": "2024-01-15"
}
```

**Business information:**
Update phone numbers, address, email, and coordinates in the `business` object.

### Translations

Edit `lib/i18n.ts` to update translations. The `translations` object contains all text strings for both French and English.

### Images

Replace placeholder images in `public/images/`:
- Gallery images: `public/images/gallery/`
- Room images: `public/images/room-[type]/`
- OG image: `public/images/og-image.jpg` (1200x630px recommended)

## Features

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Sticky bottom bar on mobile with WhatsApp and Call buttons
- Touch-friendly navigation

### SEO
- Metadata API for page-specific SEO
- Open Graph tags
- Structured data (LocalBusiness, LodgingBusiness)
- Sitemap and robots.txt
- Semantic HTML

### Bilingual Support
- French (default) and English
- Language switching in header
- Locale-based routing

### Contact Integration
- WhatsApp deep links
- Click-to-call phone links
- Reservation form with WhatsApp fallback
- Contact form with mailto fallback

## Environment Variables

No environment variables required for v1. Future phases may require:
- Email service API keys
- Analytics tracking IDs
- Google Maps API key (for embedded maps)

## TODO: Next Phases

### Content
- [ ] Add real photos to replace placeholders
- [ ] Confirm room types and pricing with hotel management
- [ ] Update Google Maps embed URL in location page
- [ ] Add actual review URLs (Google Reviews)

### Features
- [ ] Add Booking.com integration link when available
- [ ] Connect form submissions to email service or backend
- [ ] Add analytics (Google Analytics or similar)
- [ ] Implement online payment system
- [ ] Add booking calendar availability

### Technical
- [ ] Set up production domain and hosting
- [ ] Configure email service for contact forms
- [ ] Add Facebook and Google Maps URLs to structured data
- [ ] Optimize images with proper formats and sizes
- [ ] Add loading states and error handling

## License

Private - Reserved for Résidence Amizade
