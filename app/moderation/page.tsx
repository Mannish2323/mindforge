import React from 'react';

export const metadata = {
  title: 'Moderation Policy — Learn with Velmorth',
  description: 'Community and Content Moderation Policy for Learn with Velmorth',
};

export default function ModerationPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <div className="policy-logo">🌿 Velmorth</div>
          <h1>Moderation Policy</h1>
          <p className="policy-meta">Effective Date: June 2025 · Velmorth Labs</p>
        </div>
        <div className="policy-body">
          <section>
            <h2>1. Community Standards</h2>
            <p>Learn with Velmorth is a learning community. We expect all users to treat each other with respect in social features (Friends, Duels, Circles).</p>
          </section>
          <section>
            <h2>2. Prohibited Behavior</h2>
            <ul>
              <li>Harassment, bullying, or threatening other users</li>
              <li>Sharing offensive, discriminatory, or explicit content</li>
              <li>Spamming friend requests or duel challenges</li>
              <li>Using bots to manipulate XP or leaderboard rankings</li>
              <li>Impersonating other users or Velmorth staff</li>
            </ul>
          </section>
          <section>
            <h2>3. Content Moderation</h2>
            <p>User-generated content in social features is subject to review. We use a combination of automated tools and manual review to enforce these policies.</p>
          </section>
          <section>
            <h2>4. Reporting</h2>
            <p>You can report violations directly from the Social tab or by emailing <a href="mailto:moderation@velmorth.com">moderation@velmorth.com</a>. Reports are reviewed within 24–48 hours.</p>
          </section>
          <section>
            <h2>5. Enforcement</h2>
            <p>Depending on severity, violations may result in: a warning, temporary suspension, permanent ban, or legal action. We reserve the right to take action without prior notice for serious violations.</p>
          </section>
          <section>
            <h2>6. Appeals</h2>
            <p>If you believe your account was suspended unfairly, email <a href="mailto:appeals@velmorth.com">appeals@velmorth.com</a> with your username and a description of the situation.</p>
          </section>
        </div>
        <div className="policy-footer">
          <a href="/">← Back to App</a>
        </div>
      </div>
    </div>
  );
}
