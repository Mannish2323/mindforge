import React from 'react';

export const metadata = {
  title: 'Terms of Service — Learn with Velmorth',
  description: 'Terms of Service for Learn with Velmorth by Velmorth Labs',
};

export default function TermsPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <div className="policy-logo">🌿 Velmorth</div>
          <h1>Terms of Service</h1>
          <p className="policy-meta">Effective Date: June 2025 · Velmorth Labs</p>
        </div>
        <div className="policy-body">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using Learn with Velmorth, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>
          <section>
            <h2>2. Account Eligibility</h2>
            <p>You must be at least 13 years old to create an account. By registering, you confirm you meet this age requirement.</p>
          </section>
          <section>
            <h2>3. Permitted Use</h2>
            <ul>
              <li>You may use the app solely for personal, non-commercial learning purposes</li>
              <li>You may not share your account credentials</li>
              <li>You may not attempt to reverse-engineer, hack, or misuse the platform</li>
              <li>You may not use bots or automated tools to farm XP</li>
            </ul>
          </section>
          <section>
            <h2>4. Subscriptions and Billing</h2>
            <p>Paid plans (Starter ₹99, Plus ₹149, Pro ₹199) are billed monthly. You may cancel at any time; cancellation takes effect at the end of the current billing period. See Refund Policy for details.</p>
          </section>
          <section>
            <h2>5. Content Ownership</h2>
            <p>All lesson content, kanji data, and vocabulary in Learn with Velmorth are owned by Velmorth Labs. You may not redistribute or sell this content.</p>
          </section>
          <section>
            <h2>6. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive behavior, or attempt to exploit the platform.</p>
          </section>
          <section>
            <h2>7. Disclaimer</h2>
            <p>Learn with Velmorth is provided "as is". We make no guarantees about language learning outcomes or exam results.</p>
          </section>
          <section>
            <h2>8. Contact</h2>
            <p>For legal inquiries: <a href="mailto:legal@velmorth.com">legal@velmorth.com</a></p>
          </section>
        </div>
        <div className="policy-footer">
          <a href="/">← Back to App</a>
        </div>
      </div>
    </div>
  );
}
