import { NextResponse } from 'next/server';

/**
 * Returns whether Wave payment is configured (so the client can show/hide the option).
 * Does not expose the API key.
 */
export async function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.WAVE_API_KEY) });
}
