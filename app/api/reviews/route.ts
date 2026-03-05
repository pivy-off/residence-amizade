import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_URL || process.env.PAYDUNYA_BACKEND_URL || '').replace(/\/$/, '');

export async function GET(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });
  }
  try {
    const limit = request.nextUrl.searchParams.get('limit') || '100';
    const res = await fetch(`${BACKEND_URL}/api/reviews?limit=${limit}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[reviews GET]', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });
  }
  let body: { name?: string; rating?: number; text?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body?.name?.trim() || !body?.text?.trim()) {
    return NextResponse.json({ error: 'Name and text required' }, { status: 400 });
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name.trim(),
        rating: typeof body.rating === 'number' ? body.rating : 5,
        text: body.text.trim(),
        email: body.email?.trim() || '',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[reviews POST]', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
