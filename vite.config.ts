import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cache-Control": "no-cache" // Helps with worker preloading issues
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure workers are properly bundled
        manualChunks: {
          webcontainer: ['@webcontainer/api']
        }
      }
    }
  }
});
