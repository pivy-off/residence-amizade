import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_URL || process.env.PAYDUNYA_BACKEND_URL || '').replace(/\/$/, '');

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });
  }

  const { id: bookingId } = await params;
  if (!bookingId) {
    return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/bookings/${encodeURIComponent(bookingId)}/confirm`, {
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Confirm failed' },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[bookings/confirm]', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
