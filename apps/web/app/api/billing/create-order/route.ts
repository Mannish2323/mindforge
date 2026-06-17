import { NextRequest, NextResponse } from 'next/server';

// Razorpay order creation API route
// Requires: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local

const PLAN_AMOUNTS: Record<string, number> = {
  pro_monthly: 19900,  // ₹199 in paise
  pro_yearly:  99900,  // ₹999 in paise
};

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    if (!planId || !PLAN_AMOUNTS[planId]) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    const keyId     = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local' },
        { status: 503 }
      );
    }

    const amount = PLAN_AMOUNTS[planId];
    const auth   = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `velmorth_${planId}_${Date.now()}`,
        notes: { planId },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.description || 'Razorpay order creation failed');
    }

    const order = await response.json();

    return NextResponse.json({
      orderId: order.id,
      amount:  order.amount,
      currency: order.currency,
      key: keyId,
    });
  } catch (err: any) {
    console.error('Razorpay create-order error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
