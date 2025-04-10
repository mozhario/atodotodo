import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const bucketName = process.env.VITE_BUCKET_NAME || 'todo-web'

export default defineConfig({
  plugins: [react()],
  base: `/${bucketName}/`,
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
}) 