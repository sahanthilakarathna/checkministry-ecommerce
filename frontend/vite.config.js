import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: '/',        // ensures proper routing for BrowserRouter
  build: {
    outDir: 'dist', // Vercel expects static output folder
  },
});
