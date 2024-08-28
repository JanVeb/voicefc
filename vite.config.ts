// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.openai.com', // Target OpenAI API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite path to remove /api prefix
      },
    },
  },
});
