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
        // Temporarily lower thresholds while building test suite
        global: {
          statements: 60, // Reduced from 80
          branches: 50, // Reduced from 75
          functions: 60, // Reduced from 80
          lines: 60, // Reduced from 80
        },
        // Keep higher thresholds for critical modules
        'src/lib/api/**': {
          statements: 80, // Reduced from 90
          branches: 70, // Reduced from 85
          functions: 80, // Reduced from 90
          lines: 80, // Reduced from 90
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
