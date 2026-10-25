import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { bottlesPlugin } from './scripts/serve-bottles.mjs';

export default defineConfig({
  plugins: [react(), bottlesPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
