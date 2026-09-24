import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the built dist/index.html loads correctly over
  // file:// (Playwright loads it directly, no dev server involved).
  base: './',
  build: {
    assetsInlineLimit: 0, // keep the profile photo etc. as separate files, not base64
  },
});
