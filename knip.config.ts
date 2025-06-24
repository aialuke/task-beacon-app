import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    // Application entry points
    'src/main.tsx',
    'src/App.tsx',
    'index.html',

    // Styling entry points
    'src/index.css',

    // Configuration files
    'vite.config.ts',
    'tailwind.config.ts',
    'eslint.config.js',
    'postcss.config.js',

    // Testing entry points - Enhanced for React 19 patterns
    'src/test/setup.ts',
    'src/test/test-utils.tsx', // Explicitly include test utilities
    'src/**/*.test.{ts,tsx}',
    'src/**/*.spec.{ts,tsx}',
    'src/**/__tests__/**/*.{ts,tsx}',
    'src/**/integration/**/*.{ts,tsx}',

    // Type definitions that serve as entry points
    'src/**/*.d.ts',

    // React 19 specific patterns
    'src/lib/actions/**/*.ts', // Server actions
    'src/providers/**/*.tsx', // Provider patterns
  ],

  project: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/styles/**', // Ignore CSS @import chains
    '!dist/**',
    '!coverage/**',
  ],

  ignore: [
    // Generated and build files
    'src/vite-env.d.ts',
    'dist/**',
    'node_modules/**',
    '.git/**',
    'coverage/**',

    // Generated files from integrations
    'src/integrations/supabase/types.ts',

    // Styling directory (CSS imports not tracked well)
    'src/styles/**',

    // Development and tooling files
    '.cursor/**',
    '*.md',
    'public/**',
    '.env*',

    // Backup and temporary files
    'backup-*/**',
    '*-backup.*',
  ],

  ignoreDependencies: [
    // Add any dependencies that show false positives here
  ],

  // Enhanced plugin configurations for React 19 and current tech stack
  vite: {
    config: 'vite.config.ts',
    entry: ['src/main.tsx', 'index.html'],
  },

  vitest: {
    config: 'vite.config.ts',
    entry: [
      'src/test/setup.ts',
      'src/test/test-utils.tsx',
      'src/**/*.test.{ts,tsx}',
      'src/**/__tests__/**/*.{ts,tsx}',
    ],
  },

  eslint: {
    config: 'eslint.config.js',
  },

  tailwind: {
    config: 'tailwind.config.ts',
  },

  typescript: {
    config: 'tsconfig.json',
  },

  // CRITICAL: Ignore exports used in the same file they're defined
  // This solves our main false positive pattern: local interface definitions
  ignoreExportsUsedInFile: true,

  // Rule configurations for unused code detection
  rules: {
    files: 'error',
    dependencies: 'error',
    devDependencies: 'error',
    exports: 'warn', // More lenient for barrel exports
    types: 'warn', // More lenient for TypeScript type exports
  },
};

export default config;
