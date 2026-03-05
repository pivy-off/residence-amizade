# Résidence Amizade Website

Production-ready website for Résidence Amizade hotel in Ziguinchor, Senegal.

**Quick start:** `npm install` → `npm run dev` → open http://localhost:3000.  
**Payments:** See [SETUP.md](./SETUP.md) — you only add API keys when you’re ready; the site works without them.

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

2. Run the development server (uses port 3000):
```bash
npm run dev
```

3. **Open the site in your browser** — the terminal does not open it for you:
   - Open Chrome, Safari, or Firefox.
   - In the address bar type: **http://localhost:3000**
   - Press Enter. You should be redirected to **http://localhost:3000/fr**.

**If "it won't open" or the server won't start:**

- **"Address already in use" or "EADDRINUSE"** — Port 3000 is taken. Either:
  1. Stop the other app using port 3000, or
  2. Use an alternate port: run `npm run dev:alt` and open **http://localhost:3001**
- **Nothing happens in the browser** — Make sure you typed `http://localhost:3000` (with `http://`) and that the terminal shows `Ready in ... ms` before you open it.
- **Blank or error page** — Do a hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows). If it persists, run:
  ```bash
  rm -rf .next && npm run dev
  ```
  then open http://localhost:3000 again.

**If you see "Internal Server Error" or "missing required error components":**  
Stop any other running dev servers (close other terminals that ran `npm run dev`, or run `pkill -f "next dev"`), then run `npm run dev` again from this project folder. Only one instance should run so that http://localhost:3000 serves this app.

**If you see "ChunkLoadError: Loading chunk ... failed (timeout)":**  
The page chunk failed to load (often in dev). Click **Recharger la page** on the error screen, or do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R). If it keeps happening, stop the dev server, run `rm -rf .next` and `npm run dev` again.

**If you see "TypeError: undefined is not an object (evaluating 'originalFactory.call')" or similar:**  
This is usually caused by cache corruption or version skew. Run a clean install:
```bash
rm -rf .next node_modules package-lock.json && npm install && npm run dev
```
If you previously ran `npm run start` (production), unregister any service worker for localhost in DevTools → Application → Service Workers.

### Building for Production

```bash
npm run build
npm start
```

## Deploying the Frontend

The project builds successfully and is ready to deploy. Recommended: **Vercel** (free tier, built for Next.js).

### Option A: Deploy with Vercel (Git)

1. Push this project to a Git repo (GitHub, GitLab, or Bitbucket).
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **Add New** → **Project** and import your repository.
4. Vercel will detect Next.js; leave defaults and click **Deploy**.
5. Your site will get a URL like `your-project.vercel.app`. You can add a custom domain later.

### Option B: Deploy with Vercel CLI

1. Install and log in:
   ```bash
   npx vercel login
   ```
2. From the project folder, deploy:
   ```bash
   npx vercel
   ```
   For production: `npx vercel --prod`
3. Follow the prompts (link to existing project or create new). You’ll get a live URL when it finishes.

### After deployment

- **Images**: Ensure `public/images/` (hero, gallery, room photos) is committed or uploaded so they appear on the live site.
- **Environment**: No env vars are required for the current version.
- **Custom domain**: In the Vercel project dashboard, go to Settings → Domains to add your domain.

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

### Wave payment (Wave Money)
- Optional “Pay with Wave” in the booking flow (step 3)
- Uses [Wave Checkout API](https://docs.wave.com/checkout); amount = room price × nights (XOF)
- Set `WAVE_API_KEY` to enable; if unset, only “Pay later (WhatsApp/call)” is shown
- Success/error redirects back to the book page with a short message and WhatsApp/call CTAs

## Environment Variables

Copy `.env.example` to `.env` and fill as needed.

| Variable | Required | Description |
|----------|----------|-------------|
| `WAVE_API_KEY` | No | Wave Business API key from [Wave Business Portal](https://business.wave.com/dev-portal). If set, “Pay with Wave” is available; if empty, it is hidden. |

Future phases may add: email service API keys, analytics IDs, Google Maps API key.

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
- [x] Wave Money payment (optional; set WAVE_API_KEY)
- [ ] Add booking calendar availability

### Technical
- [ ] Set up production domain and hosting
- [ ] Configure email service for contact forms
- [ ] Add Facebook and Google Maps URLs to structured data
- [ ] Optimize images with proper formats and sizes
- [ ] Add loading states and error handling

## License

Private - Reserved for Résidence Amizade
