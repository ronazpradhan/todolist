/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // New color palette based on your portfolio
        'background': '#111111',       // Darker background
        'surface': '#1a1a1a',          // Cards, inputs
        'primary': '#22c55e',          // Vibrant green accent
        'primary-hover': '#16a34a',     // Darker green for hover
        'text-primary': '#f0f0f0',      // Off-white for headings
        'text-secondary': '#a0a0a0',    // Lighter gray for paragraphs
        'border': '#2a2a2a',           // Subtle borders
      }
    },
  },
  plugins: [],
}