/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← permet de contrôler le dark mode via classe, pas le système
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
