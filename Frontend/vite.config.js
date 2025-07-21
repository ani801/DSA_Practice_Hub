import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['https://dsa-practice-hub-frontend-0i71.onrender.com'],
  },
  build: {
    outDir: 'dist',
  },
})
