"""
Postgres models and session for Résidence Amizade bookings.
Availability excludes rooms with overlapping paid or non-expired pending bookings.
"""
import os
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

load_dotenv(Path(__file__).resolve().parent / ".env")

Base = declarative_base()

# Default to SQLite for local dev if DATABASE_URL not set; use Postgres in production
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./residence_amizade.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 15-minute hold for pending payments
PENDING_HOLD_MINUTES = 15


class Room(Base):
    __tablename__ = "rooms"
    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    price_per_night = Column(Integer, nullable=False)  # XOF


class Booking(Base):
    __tablename__ = "bookings"
    id = Column(String(64), primary_key=True)
    status = Column(String(32), nullable=False)  # pending, paid, cancelled, expired
    arrival_date = Column(String(10), nullable=False)
    departure_date = Column(String(10), nullable=False)
    adults = Column(Integer, default=1)
    children = Column(Integer, default=0)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), default="")
    customer_phone = Column(String(64), default="")
    total_amount = Column(Integer, nullable=False)
    currency = Column(String(8), default="XOF")
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)  # for pending: hold until this time
    paid_at = Column(DateTime, nullable=True)
    paydunya_token = Column(String(255), unique=True, nullable=True, index=True)
    paydunya_invoice_url = Column(Text, nullable=True)
    special_requests = Column(Text, default="")
    email_sent_at = Column(DateTime, nullable=True)
    email_error = Column(String(512), nullable=True)
    # One booking has one room (booking_rooms links to room_id)
    rooms = relationship("BookingRoom", back_populates="booking")


class BookingRoom(Base):
    __tablename__ = "booking_rooms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_id = Column(String(64), ForeignKey("bookings.id"), nullable=False)
    room_id = Column(String(64), ForeignKey("rooms.id"), nullable=False)
    booking = relationship("Booking", back_populates="rooms")


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    text = Column(Text, nullable=False)
    date = Column(String(10), nullable=False)  # YYYY-MM-DD
    email = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Room ids and default prices (match content/data.json). Seeded on startup.
ROOMS_SEED = [
    ("standard-single", "Chambre Standard Simple", 15000),
    ("standard-double", "Chambre Standard Double", 20000),
    ("superior-double", "Chambre Supérieure Double", 25000),
    ("family-triple", "Chambre Familiale Triple", 30000),
]


def seed_rooms_if_empty(db):
    """Ensure rooms table has rows. Idempotent."""
    if db.query(Room).first() is not None:
        return
    for rid, name, price in ROOMS_SEED:
        db.add(Room(id=rid, name=name, price_per_night=price))
    db.commit()
