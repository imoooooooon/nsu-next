import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The web app is served from https://nsu-next.vercel.app/webapp
// so all assets and routes are rooted at /webapp/.
export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom', 'lucide-react'] },
  server: { fs: { allow: ['..'] } },
  base: '/webapp/',
  build: {
    // Emits into the root project's dist so a single Vercel static deploy
    // serves the mobile prototype at / and the web app at /webapp.
    outDir: '../dist/webapp',
    emptyOutDir: true,
  },
})
