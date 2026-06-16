import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate all required fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature' },
        { status: 400 }
      );
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const body_string = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(body_string)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(generated_signature, 'hex'),
      Buffer.from(razorpay_signature, 'hex')
    );

    if (!signaturesMatch) {
      console.warn('[Razorpay] Signature mismatch — possible tampered payment:', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
      return NextResponse.json(
        { error: 'Payment verification failed. Signature mismatch.' },
        { status: 400 }
      );
    }

    // ✅ Payment is verified — safe to grant access / update DB here
    console.log('[Razorpay] Payment verified:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });

    return NextResponse.json({
      success: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      message: 'Payment verified successfully.',
    });
  } catch (error: any) {
    console.error('[Razorpay] verify-payment error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please contact support.' },
      { status: 500 }
    );
  }
}
