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
    room_id?: string;
    arrival_date?: string;
    departure_date?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    total_amount?: number;
    notes?: string;
    adminCode?: string;
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
    customer_name,
    customer_email = '',
    customer_phone = '',
    total_amount,
    notes = '',
    adminCode,
  } = body || {};

  if (!room_id || !arrival_date || !departure_date || !customer_name?.trim() || !adminCode?.trim()) {
    return NextResponse.json(
      { error: 'Missing required fields: room_id, arrival_date, departure_date, customer_name, adminCode' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/bookings/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': adminCode.trim(),
      },
      body: JSON.stringify({
        room_id,
        arrival_date,
        departure_date,
        customer_name: customer_name.trim(),
        customer_email: String(customer_email || '').trim(),
        customer_phone: String(customer_phone || '').trim(),
        total_amount: typeof total_amount === 'number' ? total_amount : undefined,
        notes: String(notes || '').trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Manual booking failed' },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[bookings/manual]', err);
    return NextResponse.json(
      { error: 'Manual booking service unavailable' },
      { status: 502 }
    );
  }
}

