# Admin checklist — Résidence Amizade payments & email

Use this list to get **real-world payments** and **confirmation emails** working.

**Stay in test mode** until the site is deployed. Use `PAYDUNYA_MODE=test` and test keys in `backend/.env`; switch to production keys and `PAYDUNYA_MODE=production` only after going live and setting a public IPN URL.

**Availability & offline bookings:** When customers book via WhatsApp/phone and pay offline, record those in the backend so the room drops out of availability. See **`DATA_UPDATES.md`** for how to set `ADMIN_SECRET` and call `POST /api/bookings/manual`.

---

## Real payments in 5 steps (simple)

1. In PayDunya dashboard: **activate production** and finish KYC if asked.
2. In PayDunya dashboard: copy **production** Master Key, Private Key, Token (not test keys).
3. In `backend/.env`: set `PAYDUNYA_MODE=production` and paste the 3 **production** keys.
4. In PayDunya dashboard: set **payout** to your bank/wallet; set **IPN URL** to your backend (e.g. `https://your-api.com/paydunya/webhook`). In `backend/.env` set `PAYDUNYA_CALLBACK_URL` to that same URL.
5. Restart the backend and do one small real payment; check in PayDunya that the money and settlement are correct.

---

## 1. PayDunya production (real money)

- [ ] **Activate PayDunya production** for the Résidence Amizade merchant (complete any KYC/compliance steps required by PayDunya).
- [ ] **Production API keys**: In PayDunya Business dashboard, copy **production** Master Key, Private Key, and Token (not test keys).
- [ ] In `backend/.env` set:
  - `PAYDUNYA_MODE=production`
  - `PAYDUNYA_MASTER_KEY=...` (production)
  - `PAYDUNYA_PRIVATE_KEY=...` (production)
  - `PAYDUNYA_TOKEN=...` (production)
- [ ] **No PayDunya login for customers**: In production, the checkout-invoice flow shows Wave / Orange Money / Free / Card without requiring a PayDunya account. If your dashboard has an option for “customer login”, disable it so customers only authorize the payment (e.g. on their phone). Our code uses the standard checkout-invoice API; the “no login” behavior is controlled by PayDunya merchant/application settings.

---

## 2. Where the money goes (payout)

- [ ] **Configure payout destination** in the PayDunya Business dashboard: set the bank account and/or mobile money wallet where PayDunya will settle funds for Résidence Amizade.
- [ ] **Our code does not move funds**: We only create invoices and confirm payment. PayDunya handles debiting the customer (e.g. Wave) and crediting your merchant account; payout to your bank/wallet is configured in PayDunya, not in this repo.
- [ ] After going live, **run a small real payment** and confirm in the PayDunya dashboard that the transaction appears and that settlement goes to the correct payout destination.

---

## 3. IPN (webhook) for payment confirmation

- [ ] **Production**: Set PayDunya dashboard **IPN URL** to your deployed backend, e.g. `https://your-api.example.com/paydunya/webhook`.
- [ ] In `backend/.env` set `PAYDUNYA_CALLBACK_URL` to that **exact same** URL.
- [ ] **Local dev**: Run `ngrok http 8001`, then set:
  - `PAYDUNYA_CALLBACK_URL=https://YOUR_NGROK_URL/paydunya/webhook`
  - In PayDunya dashboard (test app), set IPN to that same ngrok URL.

---

## 4. Confirmation email (Resend)

- [ ] Sign up at [resend.com](https://resend.com) and get an **API key**.
- [ ] In `backend/.env` set:
  - `RESEND_API_KEY=re_...`
  - Optionally `RESEND_FROM=Residence Amizade <booking@yourdomain.com>` (use a verified domain in Resend, or keep default `onboarding@resend.dev` for testing).
- [ ] Restart the backend; check logs for `Email provider: Resend configured`.
- [ ] Optional: set `CANCELLATION_POLICY_URL` to your cancellation policy page (used in the email).

---

## 5. Debugging

- **Backend health**: `GET http://localhost:8001/api/health` returns `mode`, `paydunya_configured`, `email_configured`.
- **Recent bookings**: `GET http://localhost:8001/api/bookings` returns recent bookings with `status`, `paydunya_token_last8`, `email_sent_at`, `email_error`.
- **Logs**: On webhook you’ll see “Webhook arrived”, “calling PayDunya confirm”, “confirm response”, “email send success/failed”.

---

## 6. Invoice URLs (already in code)

- `callback_url` = `PAYDUNYA_CALLBACK_URL` (IPN).
- `return_url` / `cancel_url` = `FRONTEND_URL` + locale + `?booking_id=...` (set in backend from env). No change needed if `FRONTEND_URL` is correct.
