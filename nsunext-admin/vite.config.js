import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  resolve: { dedupe: ['react', 'react-dom', 'lucide-react'] },
  server: { fs: { allow: ['..'] } },
  build: { outDir: '../dist/admin', emptyOutDir: true },
})
