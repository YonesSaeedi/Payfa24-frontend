import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        '%APP_VERSION%',
        pkg.version
      )
    }
  }
  ],
  define: {
    APP_VERSION: JSON.stringify(pkg.version)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://api.payfa24.com',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, '/api/v4'),
  //     },
  //   },
  // },
})
