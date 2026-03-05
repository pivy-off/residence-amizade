import { NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_URL || process.env.PAYDUNYA_BACKEND_URL || '').replace(/\/$/, '');

export async function GET() {
  if (!BACKEND_URL) {
    return NextResponse.json({
      enabled: false,
      reason: 'BACKEND_URL not set in project root .env (e.g. BACKEND_URL=http://localhost:8001). Restart Next.js after adding it.',
    });
  }
  const maxRetries = 3;
  const delayMs = 1200;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${BACKEND_URL}/paydunya/status`, { cache: 'no-store' });
      const data = (await res.json().catch(() => ({}))) as { configured?: boolean; message?: string };
      const enabled = data?.configured === true;
      const reason = enabled
        ? undefined
        : !res.ok
          ? 'Backend returned an error.'
          : data?.message || 'PayDunya keys not set in backend/.env (PAYDUNYA_MASTER_KEY, PAYDUNYA_PRIVATE_KEY, PAYDUNYA_TOKEN).';
      return NextResponse.json({ enabled, reason });
    } catch {
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }
      return NextResponse.json({
        enabled: false,
        reason: 'Backend not reachable. Run "npm run backend:install" once, then "npm run backend" (or "npm run dev:all"). Ensure port 8001 is free.',
      });
    }
  }
  return NextResponse.json({ enabled: false, reason: 'Backend not reachable.' });
}
