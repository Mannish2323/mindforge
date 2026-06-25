import React from 'react';

export const metadata = {
  title: 'Refund Policy — Learn with Velmorth',
  description: 'Refund Policy for Learn with Velmorth by Velmorth Labs',
};

export default function RefundPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <div className="policy-logo">🌿 Velmorth</div>
          <h1>Refund Policy</h1>
          <p className="policy-meta">Effective Date: June 2025 · Velmorth Labs</p>
        </div>
        <div className="policy-body">
          <section>
            <h2>1. Our Refund Commitment</h2>
            <p>We want you to love Learn with Velmorth. If you are not satisfied with your subscription, we offer a <strong>3-day money-back guarantee</strong> for new subscribers.</p>
          </section>
          <section>
            <h2>2. Eligibility for Refund</h2>
            <ul>
              <li>Request must be made within <strong>3 days (72 hours)</strong> of initial purchase</li>
              <li>Refunds are available for first-time purchases only</li>
              <li>Renewal charges are non-refundable</li>
              <li>Accounts banned for policy violations are not eligible for refunds</li>
            </ul>
          </section>
          <section>
            <h2>3. How to Request a Refund</h2>
            <p>Email <a href="mailto:billing@velmorth.com">billing@velmorth.com</a> with your registered email address and order ID. We will process eligible refunds within 3–5 business days.</p>
          </section>
          <section>
            <h2>4. Cancellation</h2>
            <p>You can cancel your subscription at any time from Settings → Billing. Your access continues until the end of the paid period. No partial refunds are issued for unused days after the 3-day window.</p>
          </section>
          <section>
            <h2>5. Contact</h2>
            <p>Billing support: <a href="mailto:billing@velmorth.com">billing@velmorth.com</a></p>
          </section>
        </div>
        <div className="policy-footer">
          <a href="/">← Back to App</a>
        </div>
      </div>
    </div>
  );
}
