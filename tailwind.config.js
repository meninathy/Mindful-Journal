/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'mindful-pink': '#FFADDE',
        'mindful-blue': '#ACBEFC',
        'mindful-mint': '#95F0C5',
        'mindful-lavender': '#C5C5FF',
        'mindful-yellow': '#FFD2EA',
        'mindful-peach': '#FFCC99',
        'mindful-white': '#FEFCFF',
        'mindful-dark': '#3D2C4E',
      },
      fontFamily: {
        heading: ['Quicksand', 'sans-serif'],
        body: ['Comfortaa', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(172, 190, 252, 0.25)',
        card: '0 2px 16px rgba(255, 173, 222, 0.2)',
        glow: '0 0 20px rgba(149, 240, 197, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
