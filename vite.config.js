import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Слушать на всех интерфейсах (локальный IP-адрес)
    port: 5173, // Порт по умолчанию
    strictPort: true, // Использовать только этот порт, если он занят
  },
})