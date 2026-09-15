/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        grid: {
          dark: '#0c0e12',
          card: '#13181e',
          border: '#1e262b',
          accent: '#96be5d'
        }
      }
    },
  },
  plugins: [],
}
