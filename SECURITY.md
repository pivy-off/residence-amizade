# Security — Résidence Amizade

## Backend (FastAPI)

### Security headers
All responses include:
- **X-Content-Type-Options: nosniff**
- **X-Frame-Options: DENY**
- **X-XSS-Protection: 1; mode=block**
- **Referrer-Policy: strict-origin-when-cross-origin**
- **Permissions-Policy** (geolocation, microphone, camera disabled)
- **Content-Security-Policy** (restricts scripts, styles, connections to self and PayDunya/Resend)

### Rate limiting (per IP, per minute)
| Endpoint | Limit |
|----------|--------|
| POST /api/bookings/create | 10 |
| POST /api/bookings/quote | 30 |
| POST /api/reviews | 5 |
| GET /api/bookings/lookup | 20 |
| POST …/request-cancellation | 10 |
| GET …/confirm | 30 |
| GET /api/bookings/{id} | 60 |
| GET …/calendar.ics | 30 |
| GET /api/rooms/{id}/availability | 60 |
| GET /api/reviews | 60 |
| Admin (dashboard, cancel, manual, list bookings) | 30 |
| POST /paydunya/webhook | 120 |

Responses when limited: **429 Too Many Requests** with **Retry-After: 60**.

### Input validation
- **Booking/quote:** Dates `YYYY-MM-DD`, adults/children in range, string lengths (e.g. customer_name ≤ 200, email ≤ 254, special_requests ≤ 2000).
- **Reviews:** name/text length and rating 1–5.
- **Path/query:** `booking_id` and `room_id` must match `^[a-zA-Z0-9\-_]{1,64}$` to avoid injection.

### Admin
- Admin actions require **X-Admin-Secret** (or **Authorization: Bearer &lt;secret&gt;**). Set **ADMIN_SECRET** in `backend/.env` and keep it confidential.

### PayDunya webhook
- IPN payload is verified using PayDunya’s confirm endpoint before marking a booking paid. Webhook is rate-limited by IP.

---

## Frontend (Next.js)

### Security headers
- **next.config.js:** All responses (pages + API routes) include: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, **Strict-Transport-Security (HSTS)**.
- **Middleware:** Same headers for API routes; admin pages get **X-Robots-Tag: noindex, nofollow**.

### robots.txt
- **Disallow:** `/fr/admin`, `/en/admin` so search engines do not index admin pages.

### API routes (proxy to backend)
- **Rate limiting** is applied per client IP on: booking create, quote, reviews GET/POST, lookup, request-cancellation. Limits are slightly higher than the backend to avoid blocking legitimate users before the backend.
- Client IP is forwarded to the backend as **X-Forwarded-For** so backend rate limits apply to the real client.

---

## Recommendations
- **HTTPS** is enforced via HSTS in production (Vercel/Railway provide HTTPS).
- Keep **BACKEND_URL**, **ADMIN_SECRET**, and PayDunya/Resend keys in environment variables only.
- For very high traffic, consider a shared rate-limit store (e.g. Redis) instead of in-memory.
- **Next.js:** Run `npm audit` periodically. Consider upgrading when Next.js 16+ is stable.
