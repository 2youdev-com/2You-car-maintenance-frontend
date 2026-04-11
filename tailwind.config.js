/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red:      '#E63946',
          'red-dark': '#C1121F',
          navy:     '#1D3557',
        },
        surface: {
          900: '#0A0C10',
          800: '#111318',
          700: '#181B22',
          600: '#1F232D',
          500: '#272C38',
          400: '#343B4A',
        },
        foreground:       '#F1FAEE',
        background:       '#0A0C10',
        'muted-foreground': '#6b7280',
        border:           'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        shimmer:    'shimmer 2s infinite linear',
        'float': 'float-up-down 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'rev': 'rev-engine 0.5s ease-in-out',
        'drive': 'drive-across 15s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-up-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(230, 57, 70, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(230, 57, 70, 0.3), 0 0 60px rgba(230, 57, 70, 0.1)' },
        },
        'rev-engine': {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.02)' },
          '75%': { transform: 'scale(0.98)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
