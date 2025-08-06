import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ptcg': {
        target: 'https://api.pokemontcg.io',
        changeOrigin: true,
        secure: true,
        rewrite: p => p.replace(/^\/ptcg/, '/v2'),
        headers: { 'X-Api-Key': process.env.VITE_POKEMONTCG_API_KEY || '' }
      }
    }
  }
})
