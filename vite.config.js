import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001, // cổng chạy frontend
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // địa chỉ API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // giữ nguyên /api
      }
    }
  }
})
