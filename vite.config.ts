import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the project at https://ran1979.github.io/avatarian/
  base: '/avatarian/',
});
