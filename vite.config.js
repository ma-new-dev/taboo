import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-180.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Taboo Game',
        short_name: 'Taboo',
        description: 'Fun Taboo word guessing game for families',
        theme_color: '#4f46e5',
        background_color: '#4f46e5',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/taboo/',
        start_url: '/taboo/',
        icons: [
          { src: '/taboo/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/taboo/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  base: '/taboo/',
})
