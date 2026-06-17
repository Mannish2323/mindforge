import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Razorpay payment verification API route
// Verifies HMAC signature, then updates entitlement in Supabase (service role)

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 503 });
    }

    // Step 1: Verify HMAC signature
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Step 2: Get authenticated user from Supabase
    const supabaseUrl         = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase service role key not configured' }, { status: 503 });
    }

    // Get user from authorization header
    const authHeader = req.headers.get('authorization');
    const token      = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user token
    const userClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: { user }, error: authError } = await userClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid user token' }, { status: 401 });
    }

    // Step 3: Update entitlement via service role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const isYearly = planId === 'pro_yearly';
    const startsAt = new Date();
    const endsAt   = new Date(startsAt);
    if (isYearly) {
      endsAt.setFullYear(endsAt.getFullYear() + 1);
    } else {
      endsAt.setMonth(endsAt.getMonth() + 1);
    }

    const { error: updateError } = await adminClient
      .from('entitlements')
      .upsert({
        user_id:    user.id,
        plan_id:    planId,
        status:     'pro',
        starts_at:  startsAt.toISOString(),
        ends_at:    endsAt.toISOString(),
        provider:   'razorpay',
        payment_id: razorpay_payment_id,
      });

    if (updateError) {
      console.error('Failed to update entitlement:', updateError);
      return NextResponse.json({ error: 'Failed to activate Pro' }, { status: 500 });
    }

    // Log event
    await adminClient.from('event_logs').insert({
      user_id: user.id,
      event:   'payment_success',
      payload: {
        plan_id:    planId,
        payment_id: razorpay_payment_id,
        order_id:   razorpay_order_id,
        amount:     isYearly ? 99900 : 19900,
      },
    });

    return NextResponse.json({ success: true, plan: planId });
  } catch (err: any) {
    console.error('Payment verify error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
