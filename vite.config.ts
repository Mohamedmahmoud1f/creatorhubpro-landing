import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'
import build from '@hono/vite-build/vercel'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.tsx'
    }),
    build()
  ]
})