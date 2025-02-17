import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.waltr.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v0'),
      },
      '/motor-api': {
        target: 'https://api.waltr.in/v0',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/motor-api/, ''),
        secure: false,
      },
    },
  },
});
