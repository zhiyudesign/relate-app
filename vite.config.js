import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps every asset path relative, so the built site works on
// GitHub Pages under https://<user>.github.io/<repo>/ without extra config.
export default defineConfig({
  plugins: [react()],
  base: './',
})
