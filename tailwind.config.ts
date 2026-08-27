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
          light: '#A87BFF',
          muted: '#C4A0FF',
        },
        sakura: {
          DEFAULT: '#FFB7C5',
          dark: '#F472B6',
          light: '#FFE4E1',
        },
        accent: {
          DEFAULT: '#FF6B9D',
          light: '#FF9CBB',
          magenta: '#FF6BD6',
        },
        // Light theme backgrounds
        warm: {
          DEFAULT: '#FAF8F3',
          cream: '#F5F1EA',
          soft: '#F0ECE3',
          white: '#FFFFFF',
        },
        // Text
        ink: {
          DEFAULT: '#1A1A2E',
          secondary: '#4A4A68',
          muted: '#8E8EA0',
          light: '#B5B5C3',
        },
        // Borders
        edge: {
          DEFAULT: '#E8E4DD',
          hover: '#D8D4CC',
          focus: '#C4A0FF',
        },
        // Learning categories
        cat: {
          green: '#34C759',
          'green-light': '#E8FAE8',
          blue: '#007AFF',
          'blue-light': '#E3F0FF',
          teal: '#00C7BE',
          'teal-light': '#E0FAF8',
          orange: '#FF9500',
          'orange-light': '#FFF3E0',
          purple: '#AF52DE',
          'purple-light': '#F3E8FF',
          pink: '#FF2D55',
          'pink-light': '#FFE4EA',
          yellow: '#FFCC00',
          'yellow-light': '#FFF8DC',
        },
        // Legacy compat — map neon-* tokens to new palette
        neon: {
          purple: '#6D3CFF',
          pink: '#AF52DE',
          magenta: '#FF6B9D',
        },
        bg: {
          DEFAULT: '#FAF8F3',
          surface: '#FFFFFF',
          elevated: '#F5F1EA',
          card: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F5F1EA',
          lighter: '#F0ECE3',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        jp: ['var(--font-jp)', 'Noto Sans JP', 'sans-serif'],
        heading: ['var(--font-heading)', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        orbitron: ['var(--font-heading)', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
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
        'pulse-glow': 'glow-pulse 3s ease-in-out infinite',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'card-pop': 'card-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'check-bounce': 'check-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'petal-fall': {
          '0%': { transform: 'translateY(-5vh) translateX(0px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.5' },
          '90%': { opacity: '0.5' },
          '100%': { transform: 'translateY(105vh) translateX(100px) rotate(360deg)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
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
          '0%, 100%': { boxShadow: '0 0 5px rgba(109, 60, 255, 0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(109, 60, 255, 0.2)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'card-pop': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '70%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'check-bounce': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
