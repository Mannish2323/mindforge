'use client';

import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [targetUrl, setTargetUrl] = useState('http://localhost:3000/admin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mainOrigin = window.location.origin.replace(':3002', ':3000');
      setTargetUrl(`${mainOrigin}/admin`);
    }
  }, []);

  const handleRedirect = () => {
    window.location.href = targetUrl;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B1E12',
        color: '#E8F5E9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        className="glow-effect"
        style={{
          position: 'absolute',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'rgba(74, 222, 128, 0.15)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          background: '#122619',
          border: '1px solid #1E3A27',
          borderRadius: '24px',
          padding: '40px 32px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          zIndex: 1,
        }}
      >
        {/* Shield/Alert Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 20px auto',
          }}
        >
          🛡️
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 12px 0', letterSpacing: '-0.01em' }}>
          Unified Admin Portal
        </h2>
        <p style={{ color: '#A7C4AA', fontSize: '13px', lineHeight: '1.6', margin: '0 0 28px 0' }}>
          The standalone administration panel is deprecated. Management features have been integrated directly into the main application for a seamless single sign-on experience.
        </p>

        <button
          onClick={handleRedirect}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #16A34A, #4ade80)',
            border: 'none',
            padding: '14px 20px',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Go to Web App Admin
        </button>

        <div style={{ marginTop: '16px', fontSize: '11px', color: '#5E7D63' }}>
          Redirecting to: <span style={{ textDecoration: 'underline', wordBreak: 'break-all' }}>{targetUrl}</span>
        </div>
      </div>
    </div>
  );
}
