import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.PAYDUNYA_BACKEND_URL || '';

export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: 'PayDunya backend not configured (missing BACKEND_URL)' },
      { status: 503 }
    );
  }

  let body: { bookingId: string; amount: number; name: string; email?: string; phone?: string; returnPath?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { bookingId, amount, name, email = '', phone = '', returnPath = 'fr/reserver' } = body;
  if (!bookingId || amount == null || !name) {
    return NextResponse.json(
      { error: 'Missing required fields: bookingId, amount, name' },
      { status: 400 }
    );
  }

  const amountInt = Math.round(Number(amount));
  if (amountInt <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/paydunya/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking_id: bookingId,
        amount: amountInt,
        customer_name: name,
        email: String(email),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'PayDunya create failed' },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    if (!data.invoice_url) {
      return NextResponse.json({ error: 'Invalid response from PayDunya' }, { status: 502 });
    }

    return NextResponse.json({
      invoice_url: data.invoice_url,
      token: data.token || null,
    });
  } catch (err) {
    console.error('[paydunya/create]', err);
    return NextResponse.json(
      { error: 'Payment service unavailable' },
      { status: 502 }
    );
  }
}
