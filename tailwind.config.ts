import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6D3CFF',
          dark: '#5A2AE6',
          light: '#8B5CFF',
          muted: '#A87BFF',
        },
        sakura: {
          DEFAULT: '#ffb7c5',
          dark: '#f472b6',
          light: '#ffe4e1',
        },
        accent: {
          DEFAULT: '#C15BFF',
          light: '#FF6BD6',
          magenta: '#FF6BD6',
        },
        neon: {
          purple: '#6D3CFF',
          pink: '#C15BFF',
          magenta: '#FF6BD6',
        },
        bg: {
          DEFAULT: '#09070F',
          surface: '#12101D',
          elevated: '#1A1033',
          card: 'rgba(18, 16, 29, 0.85)',
        },
        surface: {
          DEFAULT: '#12101D',
          light: '#1A1033',
          lighter: '#221640',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        jp: ['var(--font-jp)', 'Noto Sans JP', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'Orbitron', 'monospace'],
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'card-xl': '28px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      animation: {
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'petal-fall': 'petal-fall 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'petal-fall': {
          '0%': { transform: 'translateY(-5vh) translateX(0px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.7' },
          '100%': { transform: 'translateY(105vh) translateX(100px) rotate(360deg)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.25', filter: 'blur(16px)' },
          '50%': { opacity: '0.5', filter: 'blur(24px)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(109, 60, 255, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(109, 60, 255, 0.5), 0 0 40px rgba(193, 91, 255, 0.2)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
