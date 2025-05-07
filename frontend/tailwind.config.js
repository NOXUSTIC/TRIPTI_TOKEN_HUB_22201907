/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neongreen: '#39FF14',
        milkywhite: '#F9F8F0',
        cream: '#F4EFBF',
        primary: '#39FF14', // neon green as primary
        'primary-hover': '#2ecc11',
        secondary: '#F9F8F0', // milky white as secondary
        'secondary-hover': '#e6e5d9',
        background: '#111827',
        foreground: '#F9F8F0', // changed from amber to milky white for consistency
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'flat-light': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'flat-hover': '0 6px 8px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['Montserrat', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
