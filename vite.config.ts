import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { componentTagger } from 'lovable-tagger';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/test': path.resolve(__dirname, './src/test'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.git', '.cache', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules',
        'src/test/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/dist/**',
        '**/.{eslint,prettier}rc.{js,cjs,yml}',
        '**/vite.config.*',
        '**/vitest.config.*',
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80,
        },
        // Critical modules should have higher coverage
        'src/lib/api/**': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
        'src/hooks/**': {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85,
        },
        'src/features/**/hooks/**': {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85,
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'threads',
    server: {
      deps: {
        inline: [],
      },
    },
    sourcemap: true,
  },
}));
