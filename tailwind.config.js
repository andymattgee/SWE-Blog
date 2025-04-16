/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/src/components/**/*.{js,jsx,ts,tsx,}",
    "./client/src/pages/**/*.{js,jsx,ts,tsx,}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        // Add Comfortaa font family
        comfortaa: ['Comfortaa', 'sans-serif'], // Use 'sans-serif' as a fallback
      },
    },
  },
  plugins: [],
}

