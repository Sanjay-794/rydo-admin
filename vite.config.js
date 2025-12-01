import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://13.51.205.9:8080',   // <--- RIGHT TARGET
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
