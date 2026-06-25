import { NextRequest, NextResponse } from 'next/server';

// ── Plan → Razorpay amount (paise) ───────────────────────────────────────────
const PLAN_AMOUNTS: Record<string, number> = {
  starter:        9900,   // ₹99
  plus:           14900,  // ₹149
  pro:            19900,  // ₹199
  starter_yearly: 49900,  // ₹499
  plus_yearly:    79900,  // ₹799
  pro_yearly:     99900,  // ₹999
};

const PLAN_LABELS: Record<string, string> = {
  starter:        'Starter Monthly',
  plus:           'Plus Monthly',
  pro:            'Pro Monthly',
  starter_yearly: 'Starter Yearly',
  plus_yearly:    'Plus Yearly',
  pro_yearly:     'Pro Yearly',
};

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    if (!planId || !PLAN_AMOUNTS[planId]) {
      return NextResponse.json(
        { error: `Invalid plan ID "${planId}". Valid: starter, plus, pro, pro_yearly` },
        { status: 400 }
      );
    }

    const keyId     = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to env vars.' },
        { status: 503 }
      );
    }

    const amount = PLAN_AMOUNTS[planId];
    const auth   = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt:  `velmorth_${planId}_${Date.now()}`,
        notes:    { planId, label: PLAN_LABELS[planId] },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.description || 'Razorpay order creation failed');
    }

    const order = await response.json();

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      key:      keyId,
      label:    PLAN_LABELS[planId],
    });
  } catch (err: any) {
    console.error('[Billing] create-order error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
