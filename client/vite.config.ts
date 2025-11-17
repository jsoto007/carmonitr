import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = process.env.VITE_DEV_API_URL ?? 'http://127.0.0.1:5000';

export default defineConfig(({ mode }) => ({
  define: {
    __DEV__: mode !== 'production',
  },
  plugins: [react()],
  server: {
    port: 4173,
    proxy: {
      '^/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
}));
