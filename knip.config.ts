import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    // Application entry points
    'src/main.tsx',
    'src/App.tsx',
    'index.html',

    // Styling entry points (main CSS only, not @import chain)
    'src/index.css',

    // Configuration files
    'vite.config.ts',
    'tailwind.config.ts',
    'eslint.config.js',

    // Testing entry points (Solution B: Selective Test Analysis)
    'src/test/setup.ts',
    'src/**/*.test.{ts,tsx}',
    'src/**/*.spec.{ts,tsx}',
    'vitest.config.ts',

    // Type definitions
    'src/**/*.d.ts',
  ],

  project: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    // Solution A: Ignore entire styles directory (CSS @import chains)
    '!src/styles/**',
  ],

  ignore: [
    // Generated and build files
    'src/vite-env.d.ts',
    'dist/**',
    'node_modules/**',
    '.git/**',
    'coverage/**',

    // Solution A: Supabase - ignore generated files only
    'src/integrations/supabase/types.ts',

    // Solution A: Tailwind CSS - ignore entire styles directory
    'src/styles/**',

    // Development and tooling files
    '.cursor/**',
    '*.md',
    'public/**',
  ],

  ignoreDependencies: [
    // Only ignore dependencies that actually show as false positives
    // Based on actual testing, most utilities are properly detected by Knip
  ],

  // Enhanced plugin configurations for Solution B approaches
  vite: {
    config: 'vite.config.ts',
    entry: ['src/main.tsx', 'index.html'],
  },

  vitest: {
    config: 'vite.config.ts',
    // Solution B: Better test analysis
    entry: ['src/test/setup.ts'],
  },

  eslint: {
    config: 'eslint.config.js',
  },

  tailwind: {
    config: 'tailwind.config.ts',
  },
};

export default config;
