/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF4EC',
        parchment: '#F2E9DC',
        beige: '#E8D7C4',
        taupe: '#A89789',
        brown: '#75665C',
        'dark-brown': '#4A3F37',
        clay: '#B08968',
        gold: '#C5A77A',
        ink: '#3A322C',
        white: '#FFFDFC',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Jost"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      boxShadow: {
        card: '0 20px 60px -15px rgba(74, 63, 55, 0.25)',
        soft: '0 8px 30px -10px rgba(74, 63, 55, 0.18)',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
      },
      animation: {
        drift: 'drift 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
