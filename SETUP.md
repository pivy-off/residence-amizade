# Setup — Résidence Amizade

**Goal: you do as little as possible. The site runs without any keys.**

---

## Run the site (no work)

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in your browser. The site works. Booking works via **WhatsApp** and **Call** only until you add payment keys.

---

## When you want PayDunya payments (Wave, Orange, Free, Card)

**I will only ask you for these when you’re ready:**

1. **PayDunya Master Key**  
   (from PayDunya Business → your app → API keys)

2. **PayDunya Test Private Key**  
   (starts with `test_private_...`)

3. **PayDunya Test Token**  
   (from the same API keys section)

**Get online payment working (checklist):**  

1. **Install backend dependencies once** (fixes “Backend not reachable” / `ModuleNotFoundError: sqlalchemy`):  
   ```bash
   npm run backend:install
   ```
2. Copy `backend/.env.example` to `backend/.env` and paste the 3 PayDunya keys (`PAYDUNYA_MASTER_KEY`, `PAYDUNYA_PRIVATE_KEY`, `PAYDUNYA_TOKEN`).  
3. In the **project root** `.env`, set `BACKEND_URL=http://localhost:8001`. Restart Next.js after changing `.env`.  
4. **Start backend and frontend** — either:
   - **One terminal:** `npm run dev:all` (runs backend on 8001 + Next.js on 3000), or  
   - **Two terminals:** `npm run backend` in one, `npm run dev` in the other.  
5. Wait until you see `Uvicorn running on http://127.0.0.1:8001` in the terminal. Then open **http://localhost:3000**, go to Réserver → step 3. The “Payer maintenant (Wave, Orange Money, carte)” option should work.  
6. If you see **“Address already in use”** on 8001: free the port (e.g. `lsof -i :8001` then `kill <PID>`) or close the other terminal that’s running the backend.

**Availability:** When a booking is paid (webhook or confirm-on-return), that room is no longer offered for those dates. The booking page loads available rooms from the backend, so paid and active pending bookings make rooms disappear from the list.

**Optional — local IPN (payment confirmation):**  
Backend runs on **port 8001**. Run `ngrok http 8001`, copy the `https://….ngrok.io` URL, then in `backend/.env` set  
`PAYDUNYA_CALLBACK_URL=https://YOUR_NGROK_URL/paydunya/webhook`.  
In the **PayDunya dashboard**, set the IPN endpoint to this **exact same** URL. If you skip IPN, users can still pay and the “confirm on return” flow will mark the booking paid when they come back to the site.

**Confirmation email (real delivery):**  
Without an email provider, the backend only logs the confirmation text. To send real emails, set **Resend** in `backend/.env`: get an API key at [resend.com](https://resend.com), then set `RESEND_API_KEY=re_xxxx`. See `ADMIN_CHECKLIST.md` for full list.

**Production (real payments) and payout:**  
See **`ADMIN_CHECKLIST.md`** for: switching to production keys, configuring payout destination in PayDunya, and ensuring customers don’t need a PayDunya account.

---

## Summary

| What you want | What you do |
|---------------|-------------|
| Just run the site | `npm install` then `npm run dev` |
| Enable PayDunya later | When ready, send me the 3 keys above; I’ll say exactly where to paste them |

You don’t need to configure anything else for the site to run.

---

## Payment not working?

1. **“Backend not reachable” / “Paiement en ligne désactivé”**  
   - Run **`npm run backend:install`** once (installs Python deps including SQLAlchemy).  
   - Start the backend: **`npm run backend`** or **`npm run dev:all`**. You must see `Uvicorn running on http://127.0.0.1:8001`.  
   - Root `.env` must have `BACKEND_URL=http://localhost:8001`; restart Next.js after editing `.env`.  
   - If port 8001 is in use: `lsof -i :8001` then `kill <PID>`.  
   - Check **http://localhost:8001/paydunya/status** — it should show `{"configured": true}` when keys are set in `backend/.env`.

2. **Button appears but I get an error when I click it**  
   The message shown is from PayDunya or the backend. In the terminal where the backend is running you’ll see the exact PayDunya response. Typical causes: wrong or test keys used in production (or vice versa), or keys copied with extra spaces/quotes — fix in `backend/.env` and restart the backend.

3. **I’m redirected to PayDunya but payment doesn’t confirm**  
   For instant confirmation on your server you need IPN: set `PAYDUNYA_CALLBACK_URL` to a public URL (e.g. ngrok) that points to your backend’s `/paydunya/webhook`. Without it, users can still pay; you just won’t get a server-side callback until you deploy with a public URL.
