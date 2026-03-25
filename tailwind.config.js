/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef7f3',
          100: '#d5ece3',
          200: '#aad9c8',
          400: '#3fa082',
          500: '#1d8065',
          600: '#166652',
          700: '#125040',
        },
      },
    },
  },
  plugins: [],
}
