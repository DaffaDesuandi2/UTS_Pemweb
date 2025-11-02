import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], 
  build: {
    outDir: '../dist', // build keluar dari folder public
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})