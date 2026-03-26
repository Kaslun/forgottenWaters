import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#2a3a5c',
          700: '#1f2e4a',
          800: '#1a2744',
          900: '#111b30',
        },
        gold: {
          400: '#e8c55a',
          500: '#d4a843',
          600: '#b8922e',
          700: '#8a6d22',
        },
        parchment: {
          100: '#f4e4c1',
          200: '#e8d5a3',
          300: '#dcc78e',
          400: '#b8a67a',
          500: '#947f5e',
        },
        wood: {
          DEFAULT: '#3d2b1f',
          light: '#5c4033',
        },
        rope: {
          DEFAULT: '#c9a96e',
        },
      },
      fontFamily: {
        pirata: ['"Pirata One"', 'cursive'],
        body: ['"Crimson Text"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        xs: '0.8125rem',
        sm: '0.9375rem',
        base: '1.0625rem',
        lg: '1.1875rem',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'box-fill': {
          '0%': { transform: 'scale(1)', backgroundColor: 'transparent' },
          '50%': { transform: 'scale(1.3)', backgroundColor: 'var(--gold-400)' },
          '100%': { transform: 'scale(1)', backgroundColor: 'var(--gold-400)' },
        },
        'star-fill': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '40%': { transform: 'scale(1.8)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'box-fill': 'box-fill 0.4s ease-out',
        'star-fill': 'star-fill 0.5s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
