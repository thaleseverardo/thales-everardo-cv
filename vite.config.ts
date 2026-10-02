import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    base: isProd ? '/thales-everardo-cv/' : '/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script-defer',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'icon.svg',
          'robots.txt',
          'sitemap.xml',
          'llms.txt',
          'llms-full.txt',
        ],
        manifest: {
          id: '/thales-everardo-cv/',
          name: 'Thales Everardo // Systems Architect',
          short_name: 'ThalesEverardo',
          description: 'Portfolio - Thales Everardo Albuquerque Reis',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          start_url: './',
          scope: './',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,xml,txt,md}'],
          navigateFallback: isProd ? '/thales-everardo-cv/index.html' : '/index.html',
          navigateFallbackDenylist: [
            /\/sitemap\.xml$/,
            /\/robots\.txt$/,
            /\/llms\.txt$/,
            /\/llms-full\.txt$/,
            /\/resumes\/.*/,
            /\/articles\/.*/,
            /\/projects\/.*/,
            /\/pt\/.*/,
            /\/en\/.*/,
            /\/es\/.*/,
            /\/fr\/.*/,
            /\/linkedin\/?.*$/,
            /\/github\/?.*$/,
            /\/portfolio\/?.*$/,
          ],
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'portfolio-images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/resumes\/.*\.(?:pdf|txt|md)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'portfolio-resumes-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      drop: isProd ? ['debugger'] : [],
      pure: isProd ? ['console.log'] : [],
      legalComments: 'none',
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 1. Módulos pesados carregados estritamente sob demanda
            if (id.includes('node_modules/jspdf') || id.includes('node_modules/html-to-image')) {
              return 'vendor-pdf';
            }
            if (id.includes('node_modules/firebase/firestore')) {
              return 'vendor-firebase-db';
            }
            // 2. Vendor unificado para evitar disputa de banda HTTP no 4G móvel
            if (id.includes('node_modules/')) {
              return 'vendor-core';
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
