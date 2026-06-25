'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { ArrowLeft, CheckCircle2, AlertCircle, CreditCard, Lock, Zap, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface OrderResponse {
  order_id: string;
  amount: number;
  currency: string;
}

interface VerifyResponse {
  success: boolean;
  message?: string;
  payment_id?: string;
  order_id?: string;
  error?: string;
}

export default function CheckoutPage() {
  const [amountInput, setAmountInput] = useState<string>('500'); // amount in INR
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error' | 'cancelled';
    message?: string;
    details?: string;
  }>({ type: 'idle' });

  const getAmountInPaise = (inr: string): number => {
    const parsed = parseFloat(inr);
    if (isNaN(parsed)) return 0;
    return Math.round(parsed * 100);
  };

  const handlePay = async () => {
    setStatus({ type: 'idle' });
    setLoading(true);

    const amountPaise = getAmountInPaise(amountInput);

    if (amountPaise < 100) {
      setStatus({
        type: 'error',
        message: 'Invalid Amount',
        details: 'Minimum amount must be at least 100 paise (₹1).',
      });
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on the backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: `rcpt_chk_${Date.now()}`,
        }),
      });

      const orderData: OrderResponse & { error?: string } = await response.json();

      if (!response.ok || orderData.error) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        throw new Error('Razorpay client-side Key ID is not configured.');
      }

      // 2. Configure and open Razorpay Standard Checkout
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Velmorth checkout',
          description: 'Standard Web Checkout Integration Test',
          image: '/icons/icon-192.png',
          order_id: orderData.order_id,
          handler: async function (res: any) {
            // Success handler gets: razorpay_payment_id, razorpay_order_id, razorpay_signature
            setLoading(true);
            try {
              // 3. Verify signature on the backend
              const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: res.razorpay_order_id,
                  razorpay_payment_id: res.razorpay_payment_id,
                  razorpay_signature: res.razorpay_signature,
                }),
              });

              const verifyData: VerifyResponse = await verifyResponse.json();

              if (verifyResponse.ok && verifyData.success) {
                setStatus({
                  type: 'success',
                  message: 'Payment Verified Successfully!',
                  details: `Payment ID: ${res.razorpay_payment_id}\nOrder ID: ${res.razorpay_order_id}`,
                });
              } else {
                throw new Error(verifyData.error || 'Signature verification failed.');
              }
            } catch (err: any) {
              setStatus({
                type: 'error',
                message: 'Verification Failed',
                details: err.message || 'The payment signature could not be verified.',
              });
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: 'Velmorth Tester',
            email: 'tester@velmorth.com',
            contact: '9999999999',
          },
          notes: {
            purpose: 'standard_checkout_integration_test',
          },
          theme: {
            color: '#1B4332', // Velvet deep forest green
          },
          modal: {
            ondismiss: function () {
              setStatus({
                type: 'cancelled',
                message: 'Payment Cancelled',
                details: 'You closed the payment modal before completing the transaction.',
              });
              setLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);

        // Add payment.failed handler
        rzp.on('payment.failed', function (res: any) {
          setStatus({
            type: 'error',
            message: 'Payment Process Failed',
            details: `Error Code: ${res.error.code}\nDescription: ${res.error.description}\nPayment ID: ${res.error.metadata.payment_id}`,
          });
          setLoading(false);
        });

        rzp.open();
      } else {
        throw new Error('Razorpay Checkout SDK is not loaded. Please try again.');
      }
    } catch (err: any) {
      console.error('Payment checkout error:', err);
      setStatus({
        type: 'error',
        message: 'Checkout Initialization Error',
        details: err.message || 'An error occurred during order initialization.',
      });
      setLoading(false);
    }
  };

  return (
    <div className="checkout-view-container" style={{
      minHeight: '100vh',
      background: 'var(--bg-surface, #F8F5EE)',
      color: 'var(--text-1, #1C1C1E)',
      fontFamily: 'Inter, sans-serif',
      padding: '40px 20px',
    }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Outer wrapper */}
      <div style={{
        maxWidth: 540,
        margin: '0 auto',
        background: '#FFFFFF',
        borderRadius: 24,
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        animation: 'fadeIn 0.5s ease',
      }}>
        {/* Header banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
          padding: '32px 24px',
          position: 'relative',
          color: '#FFFFFF',
        }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.8)',
            textDecoration: 'none',
            fontSize: 14,
            marginBottom: 20,
            transition: 'color 0.2s',
          }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.15)',
              display: 'grid',
              placeItems: 'center',
            }}>
              <CreditCard size={22} color="#8BEA57" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Standard Checkout</h1>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Razorpay Payment Gateway</p>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div style={{ padding: '32px 24px' }}>
          {/* Status Box */}
          {status.type !== 'idle' && (
            <div style={{
              background: status.type === 'success' ? '#F0FDF4' : status.type === 'cancelled' ? '#FEF3C7' : '#FEF2F2',
              border: `1px solid ${status.type === 'success' ? '#DCFCE7' : status.type === 'cancelled' ? '#FEF3C7' : '#FEE2E2'}`,
              borderRadius: 16,
              padding: 18,
              marginBottom: 24,
              display: 'flex',
              gap: 12,
              animation: 'slideIn 0.3s ease',
            }}>
              {status.type === 'success' ? (
                <CheckCircle2 size={22} color="#16A34A" style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={22} color={status.type === 'cancelled' ? '#D97706' : '#DC2626'} style={{ flexShrink: 0 }} />
              )}
              <div>
                <h4 style={{
                  margin: '0 0 4px 0',
                  fontSize: 15,
                  fontWeight: 700,
                  color: status.type === 'success' ? '#14532D' : status.type === 'cancelled' ? '#78350F' : '#7F1D1D',
                }}>{status.message}</h4>
                {status.details && (
                  <pre style={{
                    margin: 0,
                    fontSize: 12,
                    color: status.type === 'success' ? '#15803D' : status.type === 'cancelled' ? '#B45309' : '#B91C1C',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                  }}>{status.details}</pre>
                )}
              </div>
            </div>
          )}

          {/* Amount Form */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-secondary, #6B7280)',
              marginBottom: 8,
            }}>Payment Amount (INR)</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 18,
                fontWeight: 700,
                color: '#9CA3AF',
              }}>₹</span>
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="500"
                disabled={loading}
                style={{
                  width: '100%',
                  height: 52,
                  padding: '0 16px 0 32px',
                  fontSize: 18,
                  fontWeight: 700,
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#1B4332'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#9CA3AF' }}>
              Equivalent to {getAmountInPaise(amountInput)} paise
            </p>
          </div>

          {/* Suggested options */}
          <div style={{ marginBottom: 32 }}>
            <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 8 }}>PRESETS</span>
            <div style={{ display: 'flex', gap: 12 }}>
              {['1', '10', '100', '500', '1000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={loading}
                  onClick={() => setAmountInput(preset)}
                  style={{
                    flex: 1,
                    height: 38,
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    background: amountInput === preset ? '#F0FDF4' : '#FFFFFF',
                    color: amountInput === preset ? '#1B4332' : 'var(--text-1)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    borderColor: amountInput === preset ? '#1B4332' : '#E5E7EB',
                  }}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              width: '100%',
              height: 52,
              background: '#1B4332',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 15px rgba(27,67,50,0.15)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {loading ? (
              <span style={{
                width: 20, height: 20,
                border: '3px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: '#FFFFFF',
                animation: 'spin 1s linear infinite',
              }} />
            ) : (
              <>
                <Lock size={16} /> Pay ₹{amountInput || '0'} Now
              </>
            )}
          </button>

          {/* Security & trust info */}
          <div style={{
            marginTop: 32,
            borderTop: '1px solid #F3F4F6',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            color: '#9CA3AF',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={14} color="#16A34A" /> SECURE CHECKOUT
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={14} color="#D4AC0D" /> POWERED BY RAZORPAY
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
