import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#060C18', 2: '#0A1525', 3: '#0F1D33' },
        gold: { DEFAULT: '#C9A84C', 2: '#E8C97A', 3: '#FFF3C4' },
        brand: { blue: '#2B6FD4', blue2: '#3B82F6' },
        muted: { DEFAULT: '#64748B', 2: '#94A3B8' }
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        'arabic-display': ['var(--font-amiri)', 'serif'],
        'arabic-sans': ['var(--font-tajawal)', 'sans-serif']
      },
      animation: {
        'fade-up': 'fadeUp 0.85s ease forwards',
        ticker: 'ticker 30s linear infinite',
        blink: 'blink 2s infinite',
        grow: 'grow 2s ease infinite'
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' }
        },
        grow: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '51%': { transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' }
        }
      }
    }
  },
  plugins: []
};

export default config;
