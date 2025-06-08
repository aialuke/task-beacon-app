
import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'vite.config.ts',
    'tailwind.config.ts',
    'eslint.config.js',
    'src/test/setup.ts',
    'src/**/*.test.{ts,tsx}',
    'src/**/*.spec.{ts,tsx}',
  ],
  project: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/__tests__/**',
  ],
  ignore: [
    'src/vite-env.d.ts',
    'dist/**',
    'node_modules/**',
    '.git/**',
    'coverage/**',
  ],
  ignoreBinaries: ['supabase'],
  ignoreDependencies: [
    // Removed dependencies that were identified as unused in the audit
  ],
  vite: {
    config: 'vite.config.ts',
    entry: ['src/main.tsx', 'index.html'],
  },
  vitest: {
    config: 'vite.config.ts',
  },
  eslint: {
    config: 'eslint.config.js',
  },
  tailwind: {
    config: 'tailwind.config.ts',
  },
};

export default config;
// CodeRabbit review
// CodeRabbit review
