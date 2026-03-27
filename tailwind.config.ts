import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#333348',
          700: '#1e1e32',
          800: '#1a1a2e',
          900: '#111125',
        },
        gold: {
          400: '#ffc56c',
          500: '#f0a500',
          600: '#d4920e',
          700: '#8a6d22',
        },
        parchment: {
          100: '#f1e1be',
          200: '#e0d0a8',
          300: '#d0c090',
          400: '#b0a078',
          500: '#908060',
        },
        teal: {
          400: '#44e2cd',
          500: '#2bc4b0',
          600: '#1fa393',
        },
        surface: {
          DEFAULT: '#1e1e32',
          low: '#1a1a2e',
          lowest: '#151528',
          high: '#282840',
          highest: '#333348',
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
        pirata: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'serif'],
        mono: ['var(--font-data)', 'monospace'],
      },
      fontSize: {
        xs: '0.8125rem',
        sm: '0.9375rem',
        base: '1.0625rem',
        lg: '1.1875rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        glow: '0 0 24px 0 rgba(17, 17, 37, 0.5)',
        'glow-gold': '0 0 16px 0 rgba(240, 165, 0, 0.2)',
        'glow-teal': '0 0 12px 0 rgba(68, 226, 205, 0.15)',
        ambient: '0 8px 24px 0 rgba(17, 17, 37, 0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #ffc56c, #f0a500)',
        'gold-gradient-hover': 'linear-gradient(135deg, #ffd88a, #ffc56c)',
        'glass': 'linear-gradient(135deg, rgba(30,30,50,0.6), rgba(26,26,46,0.4))',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.6' },
        },
        'box-fill': {
          '0%': { transform: 'scale(1)', backgroundColor: 'transparent' },
          '50%': { transform: 'scale(1.3)', backgroundColor: '#ffc56c' },
          '100%': { transform: 'scale(1)', backgroundColor: '#ffc56c' },
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
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'box-fill': 'box-fill 0.4s ease-out',
        'star-fill': 'star-fill 0.5s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
