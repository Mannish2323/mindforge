import React from 'react';

export const metadata = {
  title: 'Privacy Policy — Learn with Velmorth',
  description: 'Privacy Policy for Learn with Velmorth by Velmorth Labs',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <div className="policy-logo">🌿 Velmorth</div>
          <h1>Privacy Policy</h1>
          <p className="policy-meta">Effective Date: June 2025 · Velmorth Labs</p>
        </div>
        <div className="policy-body">
          <section>
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly, including your email address, display name, username, and learning preferences when you create an account or use our services.</p>
            <p>We automatically collect certain usage data when you interact with Learn with Velmorth, including lesson progress, XP earned, streak data, and device information.</p>
          </section>
          <section>
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide and improve the Learn with Velmorth service</li>
              <li>To track your learning progress and maintain your streak</li>
              <li>To send you notifications about your daily goals (if enabled)</li>
              <li>To process payments for premium subscriptions via Razorpay</li>
              <li>To display relevant content on the leaderboard and social features</li>
            </ul>
          </section>
          <section>
            <h2>3. Data Storage and Security</h2>
            <p>Your data is stored securely using Supabase (PostgreSQL) with row-level security. We implement industry-standard encryption for data in transit and at rest.</p>
          </section>
          <section>
            <h2>4. Third-Party Services</h2>
            <p>We use the following third-party services: Supabase (database), Razorpay (payments), Google (OAuth login), and Vercel (hosting). Each service has its own privacy policy.</p>
          </section>
          <section>
            <h2>5. Your Rights</h2>
            <p>You may request deletion of your account and associated data at any time through Settings → Delete Account. You may also request a copy of your data by contacting support@velmorth.com.</p>
          </section>
          <section>
            <h2>6. Cookies</h2>
            <p>We use essential cookies for authentication and session management. See our Cookie Policy for details.</p>
          </section>
          <section>
            <h2>7. Contact</h2>
            <p>For privacy inquiries: <a href="mailto:privacy@velmorth.com">privacy@velmorth.com</a></p>
            <p>Velmorth Labs · Founded by Mannish</p>
          </section>
        </div>
        <div className="policy-footer">
          <a href="/">← Back to App</a>
        </div>
      </div>
    </div>
  );
}
