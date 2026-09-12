/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          bench: '#f1f5f9',
          glass: 'rgba(255, 255, 255, 0.4)',
          shadow: 'rgba(15, 23, 42, 0.08)',
          liquid: '#e0f2fe',
        }
      }
    },
  },
  plugins: [],
}
