/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/src/components/**/*.{js,jsx,ts,tsx,}",
    "./client/src/pages/**/*.{js,jsx,ts,tsx,}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}

