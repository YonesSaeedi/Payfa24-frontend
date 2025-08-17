export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '18px',  
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        third: 'var(--third)',
        background: 'var(--background)',
        border: 'var(--border)',
        borderPrimary: 'var(--border-primary)',
        text: 'var(--text)',
        backgroundMain:'var (--background-main)',
        headerItems:'var(--header-items)',
        backgroundSyncSlider:'var(--backgroundSyncSlider)',
        backgroundCard:'var(--backgroundCard)'
      },
    },
  },
  plugins: [],
}