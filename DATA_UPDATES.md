# Updating data after deployment

How availability works, how to keep it correct when customers book offline, and how to update other site data.

---

## 1. Availability (which rooms show as available)

- **Source:** The backend database. The site calls `POST /api/bookings/quote` with dates; the backend returns only rooms that have **no overlapping paid or active pending booking**.
- **Online payments:** When a customer pays via PayDunya (Wave, Orange Money, card), the webhook or “confirm on return” marks the booking as **paid**. That room is then excluded from availability for those dates automatically.
- **Offline / WhatsApp bookings:** If a customer books by WhatsApp or phone and pays in person, that booking is **not** in the backend. The site would still show the room as available unless you record it.

**To keep availability correct when customers book offline:** record each such booking with the **manual booking** API (see below). Once recorded as paid, the room will disappear from availability for those dates.

---

## 2. Recording offline / WhatsApp bookings (manual booking)

When you confirm a reservation by WhatsApp or phone and receive payment offline, add it to the system so the room is no longer offered for those dates.

### Setup (once)

1. In `backend/.env`, set a secret (long random string):
   ```env
   ADMIN_SECRET=your-long-random-secret-here
   ```
2. Keep this secret private (do not commit `.env` or share it).

### How to add a manual booking

Send a **POST** request to your backend:

- **URL:** `https://your-backend-url.com/api/bookings/manual`  
  (e.g. on Vercel + separate backend: your backend’s base URL + `/api/bookings/manual`)
- **Header:** `X-Admin-Secret: your-long-random-secret-here`
- **Body (JSON):**
  - `room_id` (required) — one of: `standard-single`, `standard-double`, `superior-double`, `family-triple`
  - `arrival_date` (required) — `YYYY-MM-DD`
  - `departure_date` (required) — `YYYY-MM-DD`
  - `customer_name` (required)
  - `customer_email` (optional)
  - `customer_phone` (optional)
  - `total_amount` (optional) — XOF; if omitted, backend uses room price × nights
  - `notes` (optional)

**Example (curl):**

```bash
curl -X POST "https://your-backend-url.com/api/bookings/manual" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: your-long-random-secret-here" \
  -d '{
    "room_id": "standard-double",
    "arrival_date": "2026-03-15",
    "departure_date": "2026-03-18",
    "customer_name": "Jean Dupont",
    "customer_phone": "+221771234567",
    "customer_email": "jean@example.com"
  }'
```

If the room is already booked or held for those dates, you get `409` and the message explains. On success you get `200` and the booking id; the room is then excluded from availability for that range.

You can call this from:
- A browser extension (e.g. Postman), or
- A small script you run when you close a WhatsApp booking, or
- A simple internal form/page you build that calls this API (you would need to store the admin secret securely there).

---

## 3. Other data (text, prices, contact info)

| What | Where | How to update |
|------|--------|----------------|
| **Room names, descriptions, amenities, images** | `content/data.json` | Edit the JSON file and **redeploy** the site (e.g. push to Git if you use Vercel). |
| **Business phone, WhatsApp, email, address, social links** | `content/data.json` → `business` | Same: edit and redeploy. |
| **Room prices on the website (display)** | `content/data.json` → each room’s `priceFrom` | Edit and redeploy. |
| **Room prices used for booking and availability** | Backend `database.py` → `ROOMS_SEED` | Backend uses these for quote/create and manual booking. If you change prices, update `ROOMS_SEED` in `backend/database.py` to match, then redeploy the backend. |
| **List of rooms (new room type)** | Both `content/data.json` (rooms array) and `backend/database.py` (`ROOMS_SEED`) | Add the room in both places and redeploy frontend and backend. |

So: **availability** is updated automatically for online payments, and by **calling the manual booking API** for offline bookings. **Static content** (text, contact, display prices) is updated by editing `content/data.json` (and backend room data if needed) and redeploying.

---

## 4. Admin dashboard and reviews

- **Admin dashboard:** Go to **`/fr/admin/dashboard`** (or `/en/admin/dashboard`). Enter the same **admin code** as for offline bookings. You’ll see: all bookings and client details, checkout dates, room availability for the **next 6 months** (rolling window), and all reviews. Use “Add offline booking” to open the form, or “Log out” to clear the code.
- **Reviews:** Customers can leave a review on the **Avis** page (form: name, rating, text). Reviews are stored in the backend and shown on that page; admins see them in the dashboard.
