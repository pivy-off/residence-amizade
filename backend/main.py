"""
Résidence Amizade booking + PayDunya. Postgres (or SQLite) for bookings; IPN webhook marks paid and sends confirmation email.
Keys only in backend/.env; never exposed to frontend.
Run: uvicorn main:app --reload --port 8001  (or: npm run backend from project root)
"""
import json
import logging
import os
import uuid
from datetime import datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv

_env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(_env_path)

import httpx
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from sqlalchemy import text

from database import (
    Base,
    Booking,
    BookingRoom,
    PENDING_HOLD_MINUTES,
    Review,
    Room,
    SessionLocal,
    engine,
    get_db,
    seed_rooms_if_empty,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Résidence Amizade Booking + PayDunya")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _strip_env(val: str) -> str:
    s = (val or "").strip()
    if len(s) >= 2 and s[0] == s[-1] and s[0] in ('"', "'"):
        s = s[1:-1].strip()
    return s


# PayDunya: env only, never to frontend
PAYDUNYA_MASTER_KEY = _strip_env(os.getenv("PAYDUNYA_MASTER_KEY", ""))
PAYDUNYA_PRIVATE_KEY = _strip_env(os.getenv("PAYDUNYA_PRIVATE_KEY", ""))
PAYDUNYA_TOKEN = _strip_env(os.getenv("PAYDUNYA_TOKEN", ""))
PAYDUNYA_MODE = _strip_env(os.getenv("PAYDUNYA_MODE", "test")).lower()
FRONTEND_URL = (os.getenv("FRONTEND_URL", "http://localhost:3000") or "").rstrip("/")
CALLBACK_URL = _strip_env(os.getenv("PAYDUNYA_CALLBACK_URL", ""))

# PayDunya endpoints: test (sandbox) vs production. Production = no PayDunya account login for customer.
PAYDUNYA_BASE = "sandbox-api" if PAYDUNYA_MODE == "test" else "api"
PAYDUNYA_CREATE = f"https://app.paydunya.com/{PAYDUNYA_BASE}/v1/checkout-invoice/create"
PAYDUNYA_CONFIRM = f"https://app.paydunya.com/{PAYDUNYA_BASE}/v1/checkout-invoice/confirm"

logger.info("PayDunya env: file=%s exists=%s", _env_path, _env_path.exists())
logger.info("PayDunya mode=%s base_url=%s (test=sandbox simulated payments; production=real payments, no customer login)",
    PAYDUNYA_MODE, PAYDUNYA_BASE,
)
logger.info("PayDunya keys: MASTER_KEY=%s PRIVATE_KEY=%s TOKEN=%s",
    "set" if PAYDUNYA_MASTER_KEY else "MISSING",
    "set" if PAYDUNYA_PRIVATE_KEY else "MISSING",
    "set" if PAYDUNYA_TOKEN else "MISSING",
)
if CALLBACK_URL:
    logger.info("PayDunya IPN: Set dashboard IPN to same URL: %s (backend port 8001; dev: ngrok http 8001)", CALLBACK_URL)

# Email: Resend for real delivery (RESEND_API_KEY in backend/.env)
RESEND_API_KEY = _strip_env(os.getenv("RESEND_API_KEY", ""))
RESEND_FROM = _strip_env(os.getenv("RESEND_FROM", "")) or "Résidence Amizade <onboarding@resend.dev>"
CANCELLATION_POLICY_URL = os.getenv("CANCELLATION_POLICY_URL", "https://residenceamizade.sn/conditions-generales").strip()
logger.info("Email provider: %s", "Resend configured" if RESEND_API_KEY else "Not configured (set RESEND_API_KEY for real delivery)")


def _auth_headers() -> dict:
    return {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": PAYDUNYA_MASTER_KEY,
        "PAYDUNYA-PRIVATE-KEY": PAYDUNYA_PRIVATE_KEY,
        "PAYDUNYA-TOKEN": PAYDUNYA_TOKEN,
    }


# --- Startup: create tables, migrate existing DB (add new columns), seed rooms ---
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db_url = (os.getenv("DATABASE_URL") or "").lower()
    if "sqlite" in db_url or not os.getenv("DATABASE_URL"):
        for col, typ in [("email_sent_at", "DATETIME"), ("email_error", "VARCHAR(512)")]:
            try:
                with engine.connect() as conn:
                    conn.execute(text(f"ALTER TABLE bookings ADD COLUMN {col} {typ}"))
                    conn.commit()
            except Exception:
                pass
    db = SessionLocal()
    try:
        seed_rooms_if_empty(db)
    finally:
        db.close()


# --- Availability: exclude rooms with overlapping paid or non-expired pending ---
def _overlaps(arr1: str, dep1: str, arr2: str, dep2: str) -> bool:
    return arr1 < dep2 and dep1 > arr2


def get_available_room_ids(db: Session, arrival_date: str, departure_date: str) -> list[str]:
    """Room ids that have no overlapping paid booking, or overlapping pending with expires_at in future."""
    now = datetime.utcnow()
    all_rooms = {r.id for r in db.query(Room).all()}
    # Busy room ids: any booking that overlaps and (status=paid OR (status=pending and expires_at > now))
    busy = set()
    for b in db.query(Booking).filter(Booking.status.in_(["paid", "pending"])).all():
        if b.status == "paid" or (b.expires_at and b.expires_at > now):
            for br in b.rooms:
                if _overlaps(b.arrival_date, b.departure_date, arrival_date, departure_date):
                    busy.add(br.room_id)
    return list(all_rooms - busy)


# --- Email: Resend for real delivery. Mark booking.email_sent_at / email_error (caller commits). ---
def send_booking_confirmation_email(booking: Booking, room_name: str, db: Session) -> bool:
    """Send confirmation email via Resend. Set booking.email_sent_at or booking.email_error. Caller must commit. Returns True if sent."""
    to_addr = (booking.customer_email or "").strip()
    if not to_addr:
        logger.info("Booking %s: no customer email, skip confirmation", booking.id)
        return False
    if not RESEND_API_KEY:
        logger.warning("Booking %s: RESEND_API_KEY not set; email not sent. Set in backend/.env for real delivery.", booking.id)
        booking.email_error = "Email provider not configured (RESEND_API_KEY)"
        return False
    guests = (booking.adults or 1) + (booking.children or 0)
    nights = 1
    try:
        from datetime import datetime as dt
        a, d = dt.strptime(booking.arrival_date, "%Y-%m-%d"), dt.strptime(booking.departure_date, "%Y-%m-%d")
        nights = max(1, (d - a).days)
    except Exception:
        pass
    subj = f"Réservation confirmée – Résidence Amizade – {booking.id}"
    html = f"""
<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:560px;">
<p>Bonjour {booking.customer_name},</p>
<p>Votre réservation est confirmée.</p>
<table style="border-collapse:collapse;">
<tr><td style="padding:6px 12px 6px 0;"><strong>Référence</strong></td><td>{booking.id}</td></tr>
<tr><td style="padding:6px 12px 6px 0;"><strong>Chambre</strong></td><td>{room_name}</td></tr>
<tr><td style="padding:6px 12px 6px 0;"><strong>Arrivée</strong></td><td>{booking.arrival_date}</td></tr>
<tr><td style="padding:6px 12px 6px 0;"><strong>Départ</strong></td><td>{booking.departure_date}</td></tr>
<tr><td style="padding:6px 12px 6px 0;"><strong>Nuits</strong></td><td>{nights}</td></tr>
<tr><td style="padding:6px 12px 6px 0;"><strong>Voyageurs</strong></td><td>{guests}</td></tr>
<tr><td style="padding:6px 12px 6px 0;"><strong>Total</strong></td><td>{booking.total_amount} {booking.currency}</td></tr>
</table>
<p><strong>Adresse</strong> : Résidence Amizade, Ziguinchor, Sénégal<br/>
<strong>Contact</strong> : +221779159990 / contact@residenceamizade.sn</p>
<p><a href="{CANCELLATION_POLICY_URL}">Politique d'annulation</a></p>
<p>Merci de votre confiance.</p>
</body></html>
"""
    try:
        import resend
        resend.api_key = RESEND_API_KEY
        r = resend.Emails.send({
            "from": RESEND_FROM,
            "to": [to_addr],
            "subject": subj,
            "html": html,
        })
        booking.email_sent_at = datetime.utcnow()
        booking.email_error = None
        rid = (r.get("id") if isinstance(r, dict) else getattr(r, "id", None)) or ""
        logger.info("Booking %s: confirmation email sent to %s (resend id=%s)", booking.id, to_addr, rid)
        return True
    except Exception as e:
        err_msg = str(e)[:500]
        booking.email_error = err_msg
        logger.exception("Booking %s: email send failed: %s", booking.id, e)
        return False


# --- GET /health and GET /api/health (mode + email configured for debugging) ---
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/health")
async def api_health():
    """Return mode and whether email provider is configured (for debugging)."""
    return {
        "status": "ok",
        "mode": PAYDUNYA_MODE or "test",
        "paydunya_base": PAYDUNYA_BASE,
        "paydunya_configured": bool(PAYDUNYA_MASTER_KEY and PAYDUNYA_PRIVATE_KEY and PAYDUNYA_TOKEN),
        "email_configured": bool(RESEND_API_KEY),
    }


# --- GET /paydunya/status ---
@app.get("/paydunya/status")
async def paydunya_status():
    configured = bool(PAYDUNYA_MASTER_KEY and PAYDUNYA_PRIVATE_KEY and PAYDUNYA_TOKEN)
    return {"configured": configured, "message": "PayDunya keys set" if configured else "Set keys in backend/.env"}


# --- POST /api/bookings/quote ---
class QuoteRequest(BaseModel):
    arrival_date: str
    departure_date: str
    adults: int = 1
    children: int = 0


@app.post("/api/bookings/quote")
async def bookings_quote(body: QuoteRequest, db: Session = Depends(get_db)):
    """Return available rooms and total price for the stay."""
    available_ids = get_available_room_ids(db, body.arrival_date, body.departure_date)
    rooms_out = []
    for r in db.query(Room).filter(Room.id.in_(available_ids)).all():
        # nights
        try:
            a, d = datetime.strptime(body.arrival_date, "%Y-%m-%d"), datetime.strptime(body.departure_date, "%Y-%m-%d")
            nights = max(0, (d - a).days)
        except Exception:
            nights = 0
        total = r.price_per_night * nights if nights else 0
        rooms_out.append({"id": r.id, "name": r.name, "price_per_night": r.price_per_night, "nights": nights, "total": total})
    return {"available_rooms": rooms_out, "arrival_date": body.arrival_date, "departure_date": body.departure_date}


# --- POST /api/bookings/create ---
class CreateBookingRequest(BaseModel):
    room_id: str
    arrival_date: str
    departure_date: str
    adults: int = 1
    children: int = 0
    customer_name: str
    customer_email: str = ""
    customer_phone: str = ""
    special_requests: str = ""
    locale: str = "fr"  # for return_url path


@app.post("/api/bookings/create")
async def bookings_create(body: CreateBookingRequest, db: Session = Depends(get_db)):
    """Create pending booking (15 min hold), create PayDunya invoice, return booking_id and invoice_url."""
    if not all([PAYDUNYA_MASTER_KEY, PAYDUNYA_PRIVATE_KEY, PAYDUNYA_TOKEN]):
        return JSONResponse(content={"error": "PayDunya keys missing. Set in backend/.env"}, status_code=503)

    available = get_available_room_ids(db, body.arrival_date, body.departure_date)
    if body.room_id not in available:
        return JSONResponse(content={"error": "Room not available for these dates"}, status_code=409)

    room = db.query(Room).filter(Room.id == body.room_id).first()
    if not room:
        return JSONResponse(content={"error": "Room not found"}, status_code=404)

    try:
        a, d = datetime.strptime(body.arrival_date, "%Y-%m-%d"), datetime.strptime(body.departure_date, "%Y-%m-%d")
        nights = max(1, (d - a).days)
    except Exception:
        return JSONResponse(content={"error": "Invalid dates"}, status_code=400)
    total_amount = room.price_per_night * nights

    booking_id = f"bk-{uuid.uuid4().hex[:12]}"
    expires_at = datetime.utcnow() + timedelta(minutes=PENDING_HOLD_MINUTES)

    # return_url / cancel_url from FRONTEND_URL; callback_url (IPN) from PAYDUNYA_CALLBACK_URL
    path = f"{body.locale}/reserver" if body.locale else "fr/reserver"
    return_url = f"{FRONTEND_URL}/{path}?booking_id={booking_id}"
    cancel_url = f"{FRONTEND_URL}/{path}?booking_id={booking_id}&payment=cancel"
    callback_url = CALLBACK_URL or ""

    payload = {
        "invoice": {
            "total_amount": total_amount,
            "description": f"Réservation – {booking_id}",
            "customer": {"name": body.customer_name or "Client", "email": body.customer_email or "contact@residenceamizade.sn"},
        },
        "store": {"name": "Résidence Amizade"},
        "actions": {"return_url": return_url, "cancel_url": cancel_url, "callback_url": callback_url},
    }

    try:
        async with httpx.AsyncClient() as client:
            r = await client.post(PAYDUNYA_CREATE, json=payload, headers=_auth_headers(), timeout=15.0)
    except Exception as e:
        logger.exception("PayDunya create failed")
        return JSONResponse(content={"error": str(e)}, status_code=502)

    data = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
    if data.get("response_code") != "00":
        msg = data.get("response_text") or data.get("description") or "PayDunya create failed"
        return JSONResponse(content={"error": msg}, status_code=400)
    invoice_url = data.get("response_text", "")
    token = data.get("token", "")
    if not invoice_url or not token:
        return JSONResponse(content={"error": "Invalid PayDunya response"}, status_code=502)

    # Persist booking in same logical “transaction” (after PayDunya success)
    booking = Booking(
        id=booking_id,
        status="pending",
        arrival_date=body.arrival_date,
        departure_date=body.departure_date,
        adults=body.adults,
        children=body.children,
        customer_name=body.customer_name,
        customer_email=body.customer_email or "",
        customer_phone=body.customer_phone or "",
        total_amount=total_amount,
        currency="XOF",
        expires_at=expires_at,
        paydunya_token=token,
        paydunya_invoice_url=invoice_url,
        special_requests=body.special_requests or "",
    )
    db.add(booking)
    db.add(BookingRoom(booking_id=booking_id, room_id=body.room_id))
    db.commit()
    logger.info("Booking %s created pending, token=%s", booking_id, token)
    return {"booking_id": booking_id, "invoice_url": invoice_url}


# --- POST /paydunya/webhook (IPN): idempotent, confirm then mark paid, send email ---
@app.post("/paydunya/webhook")
async def paydunya_webhook(request: Request):
    """PayDunya IPN. Find booking by token, confirm with PayDunya, if completed mark paid and send confirmation email."""
    try:
        form = await request.form()
        data_raw = form.get("data")
        if isinstance(data_raw, str):
            try:
                data = json.loads(data_raw)
            except json.JSONDecodeError:
                data = {}
        else:
            data = dict(data_raw) if data_raw else {}
    except Exception:
        data = {}

    if not data:
        return JSONResponse(content={"message": "Invalid payload"}, status_code=400)

    # Token: IPN sends data.invoice.token or data.token (log parsed payload once for verification)
    invoice = data.get("invoice") or {}
    token = (invoice.get("token") or data.get("token") or "").strip()
    status = (data.get("status") or "").lower()
    logger.info("Webhook arrived: payload keys=%s token=%s status=%s", list(data.keys()), token, status)

    if not token:
        return JSONResponse(content={"message": "OK"})

    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(Booking.paydunya_token == token).first()
        if not booking:
            logger.warning("Webhook: no booking for paydunya_token=%s", token)
            return JSONResponse(content={"message": "OK"})

        if booking.status == "paid":
            return JSONResponse(content={"message": "OK"})

        logger.info("Webhook: calling PayDunya confirm for token=%s", token)
        try:
            async with httpx.AsyncClient() as client:
                cr = await client.get(f"{PAYDUNYA_CONFIRM}/{token}", headers=_auth_headers(), timeout=10.0)
            cdata = cr.json() if cr.headers.get("content-type", "").startswith("application/json") else {}
            logger.info("Webhook: confirm response code=%s status=%s", cdata.get("response_code"), cdata.get("status"))
            if cdata.get("response_code") != "00":
                logger.warning("Webhook: confirm failed token=%s response_code=%s", token, cdata.get("response_code"))
                return JSONResponse(content={"message": "OK"})
            if status != "completed":
                logger.info("Webhook: token=%s status=%s (not completed)", token, status)
                return JSONResponse(content={"message": "OK"})
        except Exception as e:
            logger.exception("Webhook: PayDunya confirm failed: %s", e)
            return JSONResponse(content={"message": "OK"})

        booking.status = "paid"
        booking.paid_at = datetime.utcnow()
        db.commit()
        room = db.query(Room).filter(Room.id == booking.rooms[0].room_id).first() if booking.rooms else None
        room_name = room.name if room else (booking.rooms[0].room_id if booking.rooms else "")
        logger.info("Webhook: booking %s marked paid; attempting email send", booking.id)
        try:
            send_booking_confirmation_email(booking, room_name, db)
            db.commit()
            if booking.email_sent_at:
                logger.info("Webhook: email send success for booking %s", booking.id)
            else:
                logger.warning("Webhook: email send failed or skipped for booking %s: %s", booking.id, booking.email_error)
        except Exception as e:
            logger.exception("Webhook: email failed (still return 200): %s", e)
            db.rollback()
        logger.info("Webhook: done booking_id=%s", booking.id)
    finally:
        db.close()
    return JSONResponse(content={"message": "OK"})


# --- GET /api/bookings/{booking_id}/confirm (confirm on return: call PayDunya confirm, mark paid if completed) ---
@app.get("/api/bookings/{booking_id}/confirm")
async def confirm_booking_on_return(booking_id: str, db: Session = Depends(get_db)):
    """When user returns from PayDunya: call PayDunya confirm endpoint; if paid, mark booking paid and send email. Idempotent. Use when IPN is not reachable (e.g. localhost)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return JSONResponse(content={"error": "Booking not found"}, status_code=404)
    if booking.status == "paid":
        room_id = booking.rooms[0].room_id if booking.rooms else None
        room = db.query(Room).filter(Room.id == room_id).first() if room_id else None
        return {
            "booking_id": booking.id,
            "status": "paid",
            "arrival_date": booking.arrival_date,
            "departure_date": booking.departure_date,
            "room_id": room_id,
            "room_name": room.name if room else room_id,
            "total_amount": booking.total_amount,
            "currency": booking.currency,
            "customer_name": booking.customer_name,
            "paid_at": booking.paid_at.isoformat() if booking.paid_at else None,
        }
    token = (booking.paydunya_token or "").strip()
    if not token:
        return JSONResponse(content={"error": "No payment token"}, status_code=400)
    try:
        async with httpx.AsyncClient() as client:
            cr = await client.get(f"{PAYDUNYA_CONFIRM}/{token}", headers=_auth_headers(), timeout=10.0)
        cdata = cr.json() if cr.headers.get("content-type", "").startswith("application/json") else {}
        if cdata.get("response_code") == "00":
            booking.status = "paid"
            booking.paid_at = datetime.utcnow()
            db.commit()
            room = db.query(Room).filter(Room.id == booking.rooms[0].room_id).first() if booking.rooms else None
            room_name = room.name if room else (booking.rooms[0].room_id if booking.rooms else "")
            logger.info("Confirm on return: booking %s marked paid; sending email", booking.id)
            try:
                send_booking_confirmation_email(booking, room_name, db)
                db.commit()
            except Exception as e:
                logger.exception("Confirm on return: email failed: %s", e)
                db.rollback()
            logger.info("Confirm on return: done booking_id=%s email_sent=%s", booking.id, bool(booking.email_sent_at))
    except Exception as e:
        logger.exception("PayDunya confirm on return failed: %s", e)
    room_id = booking.rooms[0].room_id if booking.rooms else None
    room = db.query(Room).filter(Room.id == room_id).first() if room_id else None
    return {
        "booking_id": booking.id,
        "status": booking.status,
        "arrival_date": booking.arrival_date,
        "departure_date": booking.departure_date,
        "room_id": room_id,
        "room_name": room.name if room else room_id,
        "total_amount": booking.total_amount,
        "currency": booking.currency,
        "customer_name": booking.customer_name,
        "paid_at": booking.paid_at.isoformat() if booking.paid_at else None,
    }


# --- GET /api/bookings/{booking_id} ---
@app.get("/api/bookings/{booking_id}")
async def get_booking(booking_id: str, db: Session = Depends(get_db)):
    """Return booking status and details for frontend (paid -> show confirmed; pending -> confirming; etc.)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return JSONResponse(content={"error": "Booking not found"}, status_code=404)
    room_id = booking.rooms[0].room_id if booking.rooms else None
    room = db.query(Room).filter(Room.id == room_id).first() if room_id else None
    return {
        "booking_id": booking.id,
        "status": booking.status,
        "arrival_date": booking.arrival_date,
        "departure_date": booking.departure_date,
        "room_id": room_id,
        "room_name": room.name if room else room_id,
        "total_amount": booking.total_amount,
        "currency": booking.currency,
        "customer_name": booking.customer_name,
        "paid_at": booking.paid_at.isoformat() if booking.paid_at else None,
    }


# --- POST /api/bookings/manual (record offline/WhatsApp booking so availability updates) ---
ADMIN_SECRET = _strip_env(os.getenv("ADMIN_SECRET", ""))
logger.info("Manual booking admin secret: %s (set ADMIN_SECRET in backend/.env if missing)", "set" if ADMIN_SECRET else "MISSING")


class ManualBookingRequest(BaseModel):
    room_id: str
    arrival_date: str
    departure_date: str
    customer_name: str
    customer_email: str = ""
    customer_phone: str = ""
    total_amount: int | None = None  # optional; if omitted, computed from room price × nights
    notes: str = ""


def _check_admin_secret(request: Request) -> bool:
    if not ADMIN_SECRET:
        return False
    secret = (request.headers.get("X-Admin-Secret") or request.headers.get("Authorization") or "").strip()
    if secret.startswith("Bearer "):
        secret = secret[7:].strip()
    return secret == ADMIN_SECRET


@app.post("/api/bookings/manual")
async def create_manual_booking(body: ManualBookingRequest, request: Request, db: Session = Depends(get_db)):
    """Record an offline/WhatsApp booking so the room drops out of availability. Requires X-Admin-Secret header."""
    if not _check_admin_secret(request):
        return JSONResponse(content={"error": "Unauthorized"}, status_code=401)
    room = db.query(Room).filter(Room.id == body.room_id).first()
    if not room:
        return JSONResponse(content={"error": "Room not found"}, status_code=404)
    available = get_available_room_ids(db, body.arrival_date, body.departure_date)
    if body.room_id not in available:
        return JSONResponse(
            content={"error": "Room not available for these dates (already booked or held)"},
            status_code=409,
        )
    try:
        a, d = datetime.strptime(body.arrival_date, "%Y-%m-%d"), datetime.strptime(body.departure_date, "%Y-%m-%d")
        nights = max(1, (d - a).days)
    except Exception:
        return JSONResponse(content={"error": "Invalid dates (use YYYY-MM-DD)"}, status_code=400)
    total = body.total_amount if body.total_amount is not None else room.price_per_night * nights
    booking_id = f"bk-manual-{uuid.uuid4().hex[:10]}"
    booking = Booking(
        id=booking_id,
        status="paid",
        arrival_date=body.arrival_date,
        departure_date=body.departure_date,
        adults=1,
        children=0,
        customer_name=body.customer_name,
        customer_email=body.customer_email or "",
        customer_phone=body.customer_phone or "",
        total_amount=total,
        currency="XOF",
        expires_at=None,
        paydunya_token=None,
        paydunya_invoice_url=None,
        special_requests=body.notes or "",
        paid_at=datetime.utcnow(),
    )
    db.add(booking)
    db.add(BookingRoom(booking_id=booking_id, room_id=body.room_id))
    db.commit()
    logger.info("Manual booking %s: room=%s %s–%s customer=%s", booking_id, body.room_id, body.arrival_date, body.departure_date, body.customer_name)
    return {"booking_id": booking_id, "room_id": body.room_id, "arrival_date": body.arrival_date, "departure_date": body.departure_date, "status": "paid"}


# --- Reviews: POST (create) and GET (list for display) ---
class CreateReviewRequest(BaseModel):
    name: str
    rating: int  # 1-5
    text: str
    email: str = ""


@app.post("/api/reviews")
async def create_review(body: CreateReviewRequest, db: Session = Depends(get_db)):
    """Create a review (e.g. from the website form)."""
    if not body.name or not body.text:
        return JSONResponse(content={"error": "Name and text required"}, status_code=400)
    rating = max(1, min(5, int(body.rating) if body.rating else 5))
    today = datetime.utcnow().strftime("%Y-%m-%d")
    review = Review(name=body.name.strip(), rating=rating, text=body.text.strip(), date=today, email=(body.email or "").strip())
    db.add(review)
    db.commit()
    db.refresh(review)
    logger.info("Review created id=%s name=%s rating=%s", review.id, review.name, review.rating)
    return {"id": review.id, "name": review.name, "rating": review.rating, "text": review.text, "date": review.date}


@app.get("/api/reviews")
async def list_reviews(limit: int = 100, db: Session = Depends(get_db)):
    """List reviews for public display (newest first)."""
    rows = db.query(Review).order_by(Review.created_at.desc()).limit(limit).all()
    return {"reviews": [{"id": str(r.id), "name": r.name, "rating": r.rating, "text": r.text, "date": r.date} for r in rows]}


# --- GET /api/admin/dashboard: admin-only, all data for dashboard (bookings, 6-month availability, reviews) ---
def _build_availability_6m(db: Session) -> list:
    """From today, next 6 months: per room, list of booked ranges (paid or active pending)."""
    from datetime import timedelta
    now = datetime.utcnow()
    start = now.date()
    end = start + timedelta(days=180)
    start_str = start.strftime("%Y-%m-%d")
    end_str = end.strftime("%Y-%m-%d")
    rooms = db.query(Room).all()
    result = []
    for room in rooms:
        booked_ranges = []
        for b in db.query(Booking).filter(Booking.status.in_(["paid", "pending"])).all():
            if b.status == "pending" and b.expires_at and b.expires_at <= now:
                continue
            for br in b.rooms:
                if br.room_id != room.id:
                    continue
                # clip to our window
                arr, dep = b.arrival_date, b.departure_date
                if dep <= start_str or arr >= end_str:
                    continue
                booked_ranges.append({"arrival_date": arr, "departure_date": dep, "booking_id": b.id, "status": b.status})
        result.append({"room_id": room.id, "room_name": room.name, "booked_ranges": booked_ranges})
    return {"start_date": start_str, "end_date": end_str, "rooms": result}


@app.get("/api/admin/dashboard")
async def admin_dashboard(request: Request, db: Session = Depends(get_db)):
    """Admin-only: bookings, rooms, 6-month availability, reviews. Requires X-Admin-Secret header."""
    if not _check_admin_secret(request):
        return JSONResponse(content={"error": "Unauthorized"}, status_code=401)
    bookings_raw = db.query(Booking).order_by(Booking.created_at.desc()).limit(500).all()
    bookings_out = []
    for b in bookings_raw:
        room_id = b.rooms[0].room_id if b.rooms else None
        room = db.query(Room).filter(Room.id == room_id).first() if room_id else None
        room_name = room.name if room else room_id
        bookings_out.append({
            "id": b.id,
            "status": b.status,
            "arrival_date": b.arrival_date,
            "departure_date": b.departure_date,
            "checkout_date": b.departure_date,
            "room_id": room_id,
            "room_name": room_name,
            "customer_name": b.customer_name,
            "customer_email": b.customer_email,
            "customer_phone": b.customer_phone,
            "adults": b.adults,
            "children": b.children,
            "total_amount": b.total_amount,
            "currency": b.currency,
            "special_requests": b.special_requests,
            "created_at": b.created_at.isoformat() if b.created_at else None,
            "paid_at": b.paid_at.isoformat() if b.paid_at else None,
            "email_sent_at": b.email_sent_at.isoformat() if b.email_sent_at else None,
        })
    rooms_out = [{"id": r.id, "name": r.name, "price_per_night": r.price_per_night} for r in db.query(Room).all()]
    availability_6m = _build_availability_6m(db)
    reviews_raw = db.query(Review).order_by(Review.created_at.desc()).limit(200).all()
    reviews_out = [{"id": str(r.id), "name": r.name, "rating": r.rating, "text": r.text, "date": r.date, "email": r.email or "", "created_at": r.created_at.isoformat() if r.created_at else None} for r in reviews_raw]
    return {
        "bookings": bookings_out,
        "rooms": rooms_out,
        "availability_6m": availability_6m,
        "reviews": reviews_out,
    }


# --- GET /api/bookings (admin/debug: list recent bookings with token and email status) ---
@app.get("/api/bookings")
async def list_bookings(limit: int = 50, db: Session = Depends(get_db)):
    """List recent bookings for debugging. Shows status, paydunya_token (masked), email_sent_at, email_error."""
    rows = db.query(Booking).order_by(Booking.created_at.desc()).limit(limit).all()
    out = []
    for b in rows:
        room_id = b.rooms[0].room_id if b.rooms else None
        token = (b.paydunya_token or "")[-8:] if b.paydunya_token else None
        out.append({
            "id": b.id,
            "status": b.status,
            "arrival_date": b.arrival_date,
            "departure_date": b.departure_date,
            "room_id": room_id,
            "total_amount": b.total_amount,
            "customer_name": b.customer_name,
            "customer_email": b.customer_email,
            "paydunya_token_last8": f"...{token}" if token else None,
            "email_sent_at": b.email_sent_at.isoformat() if b.email_sent_at else None,
            "email_error": b.email_error,
            "created_at": b.created_at.isoformat() if b.created_at else None,
            "paid_at": b.paid_at.isoformat() if b.paid_at else None,
        })
    return {"bookings": out, "mode": PAYDUNYA_MODE}
