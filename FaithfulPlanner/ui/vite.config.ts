import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // below configuration is making local IP addresses work
  // e.g. http://127.0.0.1:5173/, http://10.0.0.180:5173/
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
});
