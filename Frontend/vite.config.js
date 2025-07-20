import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.js
export default defineConfig({
  // ...other settings
  server: {
    host: true, // allow access from external sources
    allowedHosts: ['https://dsa-practice-hub-frontend-0i71.onrender.com'],
  },
});

