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
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
          light: '#a78bfa',
        },
        sakura: {
          DEFAULT: '#ffb7c5',
          dark: '#f472b6',
          light: '#ffe4e1',
        },
        accent: {
          DEFAULT: '#db2777',
          light: '#f472b6',
        },
        bg: {
          DEFAULT: '#09071a', // main dark background
          alt: '#0e0b22',
          deep: '#130930',
          card: 'rgba(255,255,255,0.05)', // glass card backdrop
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        jp: ['var(--font-jp)', 'Noto Sans JP', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out infinite',
        'petal-fall': 'petal-fall 10s linear infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'petal-fall': {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(110%) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
