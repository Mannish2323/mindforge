import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Server-side only — KEY_SECRET never reaches the browser
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    // Validate — minimum 100 paise (₹1)
    if (!amount || typeof amount !== 'number' || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is 100 paise (₹1).' },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount,            // in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('[Razorpay] create-order error:', error);

    if (error?.statusCode === 401) {
      return NextResponse.json(
        { error: 'Razorpay authentication failed. Check your KEY_ID and KEY_SECRET.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}
