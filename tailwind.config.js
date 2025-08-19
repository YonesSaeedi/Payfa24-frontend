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

        blue2: 'var(--blue2)',
        green1: 'var(--green1)',
        grey1: 'var(--grey1)',
        background: 'var(--background)',
        backgroundMain: 'var(--background-main)',
        border: 'var(--border)',
        borderPrimary: 'var(--border-primary)',
        borderSecondary: 'var(--border-secondary)',
        text: 'var(--text)',
        backgroundMain:'var (--background-main)',
        headerItems:'var(--header-items)',
        backgroundSyncSlider:'var(--backgroundSyncSlider)',
        backgroundCard:'var(--backgroundCard)',
        text2: 'var(--text2)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        bg4: 'var(--bg4)',
        text3: 'var(--text3)',
        text4: 'var(--text4)',
        text5: 'var(--text5)',
        text6: 'var(--text6)',
        text7: 'var(--text7)',
      },
    },
  },
  plugins: [],
}