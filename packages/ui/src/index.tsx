import React from 'react';

// Glassmorphic Card Component
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ children, className = '', onClick, style }) => {
  return (
    <div
      onClick={onClick}
      className={`card-glass ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
        transition: 'transform var(--t-normal), box-shadow var(--t-normal), border-color var(--t-normal)',
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Duolingo-style bouncy Button Component
export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'ghost': return 'btn-ghost';
      case 'danger': return 'btn-danger';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'btn-sm';
      case 'md': return '';
      case 'lg': return 'btn-lg';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${fullWidth ? 'btn-full' : ''} ${className}`}
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        ...style
      }}
    >
      {children}
    </button>
  );
};

// Simple Modal
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-4)',
      }}
    >
      <div
        className="card-glass"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '20px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
