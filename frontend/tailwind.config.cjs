

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← esto es clave
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
