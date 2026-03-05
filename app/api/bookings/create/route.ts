import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_URL || process.env.PAYDUNYA_BACKEND_URL || '').replace(/\/$/, '');

export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: 'Backend not configured (missing BACKEND_URL)' },
      { status: 503 }
    );
  }

  let body: {
    room_id: string;
    arrival_date: string;
    departure_date: string;
    adults?: number;
    children?: number;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    special_requests?: string;
    locale?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    room_id,
    arrival_date,
    departure_date,
    adults = 1,
    children = 0,
    customer_name,
    customer_email = '',
    customer_phone = '',
    special_requests = '',
    locale = 'fr',
  } = body;

  if (!room_id || !arrival_date || !departure_date || !customer_name?.trim()) {
    return NextResponse.json(
      { error: 'Missing required fields: room_id, arrival_date, departure_date, customer_name' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/bookings/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_id,
        arrival_date,
        departure_date,
        adults: Number(adults) || 1,
        children: Number(children) || 0,
        customer_name: customer_name.trim(),
        customer_email: String(customer_email || '').trim(),
        customer_phone: String(customer_phone || '').trim(),
        special_requests: String(special_requests || '').trim(),
        locale: String(locale || 'fr'),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Booking create failed' },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    if (!data.booking_id || !data.invoice_url) {
      return NextResponse.json({ error: 'Invalid response from backend' }, { status: 502 });
    }

    return NextResponse.json({
      booking_id: data.booking_id,
      invoice_url: data.invoice_url,
    });
  } catch (err) {
    console.error('[bookings/create]', err);
    return NextResponse.json(
      { error: 'Booking service unavailable' },
      { status: 502 }
    );
  }
}
