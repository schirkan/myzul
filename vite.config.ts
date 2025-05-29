// Diese Datei ist veraltet. Bitte benutze 'vite.config.mjs' für die Vite-Konfiguration.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: 'build',
  },
  root: '.', // Setzt das Projekt-Root-Verzeichnis explizit
  publicDir: 'public', // Setzt das Public-Verzeichnis explizit
});
