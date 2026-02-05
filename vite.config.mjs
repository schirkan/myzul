import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Azul Board Game',
        short_name: 'Azul',
        description: 'Myzul Boardgame client',
        theme_color: '#644195',
        icons: [
          {
            src: 'android-chrome-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*'],
      }
    }),
    tsconfigPaths()
  ],
  server: {
    open: true,
  },
  build: {
    outDir: 'build',
  },
  root: '.',
  publicDir: 'public',
});
