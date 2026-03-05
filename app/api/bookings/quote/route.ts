import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_URL || process.env.PAYDUNYA_BACKEND_URL || '').replace(/\/$/, '');

export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });
  }

  let body: { arrival_date?: string; departure_date?: string; adults?: number; children?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const arrival_date = body.arrival_date || '';
  const departure_date = body.departure_date || '';
  if (!arrival_date || !departure_date) {
    return NextResponse.json({ error: 'Missing arrival_date or departure_date' }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/bookings/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arrival_date,
        departure_date,
        adults: body.adults ?? 1,
        children: body.children ?? 0,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[bookings/quote]', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
