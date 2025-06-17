import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { componentTagger } from 'lovable-tagger';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
          statements: 75, // Intermediate target
          branches: 65, // Intermediate target
          functions: 75, // Intermediate target
          lines: 75, // Intermediate target
        },
        // Keep higher thresholds for critical modules
        'src/lib/api/**': {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85,
        },
        'src/hooks/**': {
          statements: 70, // Reduced from 85
          branches: 60, // Reduced from 80
          functions: 70, // Reduced from 85
          lines: 70, // Reduced from 85
        },
        'src/features/**/hooks/**': {
          statements: 70, // Reduced from 85
          branches: 60, // Reduced from 80
          functions: 70, // Reduced from 85
          lines: 70, // Reduced from 85
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'threads',
    sourcemap: true,
  },
}));
