import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false, // Generate a single CSS file
  },
  css: {
    postcss: true, // Use the postcss.config.cjs in the root directory
  }
})
