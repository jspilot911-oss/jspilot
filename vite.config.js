import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/jspilot/',
  plugins: [
    react(),
    tailwindcss()
  ],
})
// https://vite.dev/config/
export default defineConfig({
  base: '/jspilot/',
  plugins: [
    react(),
    tailwindcss()
  ],
})
