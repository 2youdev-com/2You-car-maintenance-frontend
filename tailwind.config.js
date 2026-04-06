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
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
