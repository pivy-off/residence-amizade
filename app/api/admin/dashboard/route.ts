import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_URL || process.env.PAYDUNYA_BACKEND_URL || '').replace(/\/$/, '');

export async function GET(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });
  }
  const secret = request.headers.get('X-Admin-Secret') || request.nextUrl.searchParams.get('adminCode') || '';
  if (!secret.trim()) {
    return NextResponse.json({ error: 'Admin code required' }, { status: 401 });
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/dashboard`, {
      headers: { 'X-Admin-Secret': secret.trim() },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/dashboard]', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
