export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        third: 'var(--third)',
        background: 'var(--background)',
        border: 'var(--border)',
        borderPrimary: 'var(--border-primary)',
        text: 'var(--text)',
      },
    },
  },
  plugins: [],
}