import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './', // relative paths, so the build also works inside Capacitor and Tauri
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Tic-Tac-Toe',
        short_name: 'Tic-Tac-Toe',
        description: 'Play tic-tac-toe against a friend or the computer.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#14151c',
        theme_color: '#4a5ce8',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // The icon artwork stays inside the central 60%, so it is safe to use as maskable too.
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // Precache everything the app needs so it works offline after the first visit.
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'] },
    }),
  ],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node', // game logic has no DOM code
  },
});
