/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        third:'var(--third)',
        background:'var(--background)',
        border:'var(--border)',
        borderPrimary:'var(--borderPrimary)',
text:'var(--text)'

      },
    },
  },
   darkMode:"media",
  plugins: [],
}