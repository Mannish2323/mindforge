import React from 'react';

export const metadata = {
  title: 'Cookie Policy — Learn with Velmorth',
  description: 'Cookie Policy for Learn with Velmorth by Velmorth Labs',
};

export default function CookiesPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <div className="policy-logo">🌿 Velmorth</div>
          <h1>Cookie Policy</h1>
          <p className="policy-meta">Effective Date: June 2025 · Velmorth Labs</p>
        </div>
        <div className="policy-body">
          <section>
            <h2>1. What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit our web app. They help us remember your preferences and keep you signed in.</p>
          </section>
          <section>
            <h2>2. Cookies We Use</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px', fontWeight: 700 }}>Cookie</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontWeight: 700 }}>Purpose</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontWeight: 700 }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '13px' }}>sb-auth-token</td>
                  <td style={{ padding: '8px' }}>Authentication session</td>
                  <td style={{ padding: '8px' }}>Session</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '13px' }}>velmorth-theme</td>
                  <td style={{ padding: '8px' }}>Theme preference</td>
                  <td style={{ padding: '8px' }}>1 year</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '13px' }}>velmorth-store</td>
                  <td style={{ padding: '8px' }}>Local learning state</td>
                  <td style={{ padding: '8px' }}>Persistent</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section>
            <h2>3. Third-Party Cookies</h2>
            <p>Supabase may set cookies for authentication. Razorpay may set cookies during payment processing. These are governed by their respective policies.</p>
          </section>
          <section>
            <h2>4. Managing Cookies</h2>
            <p>You can disable cookies in your browser settings. Note that disabling essential cookies may prevent you from signing in or using certain features.</p>
          </section>
          <section>
            <h2>5. Contact</h2>
            <p>For cookie-related queries: <a href="mailto:privacy@velmorth.com">privacy@velmorth.com</a></p>
          </section>
        </div>
        <div className="policy-footer">
          <a href="/">← Back to App</a>
        </div>
      </div>
    </div>
  );
}
