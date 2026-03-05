import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.PAYDUNYA_BACKEND_URL || '';

export async function GET(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json({ enabled: false, status: null });
  }

  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ enabled: true, status: null });
  }

  try {
    const res = await fetch(
      `${BACKEND_URL.replace(/\/$/, '')}/api/paydunya/status?token=${encodeURIComponent(token)}`
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ enabled: true, status: data.status ?? null, token: data.token });
  } catch {
    return NextResponse.json({ enabled: true, status: null, token });
  }
}
