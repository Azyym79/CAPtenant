import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',                 // ✅ THIS is the only addition
  plugins: [react()],
  server: {
    proxy: {
      '/ask-ai': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/rewrite': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/rewrite-multilingual': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
