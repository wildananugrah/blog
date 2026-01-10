import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const port = parseInt(env.VITE_PORT || '5173')
  const apiUrl = env.VITE_API_URL || 'http://localhost:3001'
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(',').map(h => h.trim())
    : ['localhost']

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port,
      allowedHosts,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
