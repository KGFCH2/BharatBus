/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // use class strategy so we toggle 'dark' on the <html>
  theme: {
    extend: {},
  },
  plugins: [],
};
