import { NextRequest, NextResponse } from 'next/server';

const WAVE_API_BASE = 'https://api.wave.com';

export interface WaveCheckoutBody {
  amount: string;
  successUrl: string;
  errorUrl: string;
  clientReference?: string;
}

/**
 * Creates a Wave Checkout session and returns the payment URL.
 * Requires WAVE_API_KEY in environment (from Wave Business Portal).
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.WAVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Wave payment is not configured (missing WAVE_API_KEY)' },
      { status: 503 }
    );
  }

  let body: WaveCheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { amount, successUrl, errorUrl, clientReference } = body;
  if (!amount || !successUrl || !errorUrl) {
    return NextResponse.json(
      { error: 'Missing required fields: amount, successUrl, errorUrl' },
      { status: 400 }
    );
  }

  // XOF amounts must be whole numbers (no decimals)
  const amountStr = String(Math.round(Number(amount)));
  if (amountStr === 'NaN' || Number(amountStr) <= 0) {
    return NextResponse.json(
      { error: 'Invalid amount' },
      { status: 400 }
    );
  }

  const payload: Record<string, string> = {
    amount: amountStr,
    currency: 'XOF',
    success_url: successUrl,
    error_url: errorUrl,
  };
  if (clientReference && clientReference.length <= 255) {
    payload.client_reference = clientReference;
  }

  try {
    const res = await fetch(`${WAVE_API_BASE}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data?.error?.message || data?.message || res.statusText;
      return NextResponse.json(
        { error: message || 'Wave checkout failed' },
        { status: res.status >= 500 ? 502 : 400 }
      );
    }

    const waveLaunchUrl = data.wave_launch_url;
    if (!waveLaunchUrl) {
      return NextResponse.json(
        { error: 'Invalid response from Wave' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      waveLaunchUrl,
      sessionId: data.id || null,
    });
  } catch (err) {
    console.error('[wave-checkout]', err);
    return NextResponse.json(
      { error: 'Payment service unavailable' },
      { status: 502 }
    );
  }
}
