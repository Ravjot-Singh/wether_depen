import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.OPENWEATHER_API_KEY || ''

  const proxy = {
    '/api/weather': {
      target: 'https://api.openweathermap.org',
      changeOrigin: true,
      rewrite: (path) => {
        const url = new URL(path.replace(/^\/api\/weather/, '/data/2.5/weather'), 'http://localhost')
        url.searchParams.set('appid', apiKey)
        url.searchParams.set('units', 'metric')
        return url.pathname + url.search
      },
    },
  }

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  }
})
