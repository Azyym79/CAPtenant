import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ✅ Main AI endpoint for FAQ and Voice
      '/ask-ai': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // ✅ Added: Basic Rewrite endpoint for Letter Generator
      '/rewrite': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // ✅ Multilingual Rewrite endpoint
      '/rewrite-multilingual': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})