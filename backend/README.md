# PayDunya Backend (FastAPI)

Résidence Amizade payment backend: creates PayDunya checkout invoices and handles IPN (Instant Payment Notification) so PayDunya can confirm payments (Wave, Orange Money, Free Money, Card).

## Setup

1. **Python 3.10+** and create a virtualenv:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Copy env and fill keys** (from PayDunya Business dashboard):
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `PAYDUNYA_MASTER_KEY`, `PAYDUNYA_PRIVATE_KEY`, `PAYDUNYA_TOKEN` from PayDunya
   - `PAYDUNYA_MODE=test` (or `production`)
   - `FRONTEND_URL=http://localhost:3000` (your Next.js app)
   - `PAYDUNYA_CALLBACK_URL` = **public** URL of this backend’s webhook (see below)

3. **IPN (webhook) must be publicly reachable**
   - Local: run `ngrok http 8000`, then set:
     - In `.env`: `PAYDUNYA_CALLBACK_URL=https://YOUR_NGROK_URL.ngrok.io/paydunya/webhook`
     - In PayDunya dashboard: set IPN URL to the same `https://YOUR_NGROK_URL.ngrok.io/paydunya/webhook`
   - Production: deploy this backend and set `PAYDUNYA_CALLBACK_URL` and the same URL in PayDunya.

## Run

```bash
uvicorn main:app --reload --port 8000
```

## Next.js

- In the Next.js project set `BACKEND_URL=http://localhost:8000` (or your deployed backend URL).
- Booking flow will call `POST /api/paydunya/create` (Next.js proxies to this backend), then redirect the user to `invoice_url`. After payment, PayDunya POSTs to `/paydunya/webhook` on this backend.

## Endpoints

- **POST /api/paydunya/create** — Body: `booking_id`, `amount`, `name`, `email`, `phone`, `return_path`. Returns `invoice_url`, `token`.
- **POST /paydunya/webhook** — PayDunya IPN; verifies hash, confirms status, marks payment completed.
- **GET /api/paydunya/status?token=xxx** — Returns payment status for a token (for optional frontend poll).
