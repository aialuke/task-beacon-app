import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // === PROJECT SCOPE ===
  // Define which files to analyze for dependencies and exports
  entry: [
    // Main application entry points
    'src/main.tsx',
    'src/App.tsx',
    'index.html',
    
    // Configuration files
    'vite.config.ts',
    'tailwind.config.ts', 
    'eslint.config.js',
    'postcss.config.js',
    
    // Test setup and entry points
    'src/test/setup.ts',
    'src/test/integration/setup.ts',
    'src/**/*.test.{ts,tsx}',
    'src/**/*.spec.{ts,tsx}',
    
    // Component stories (if using Storybook)
    'src/**/*.stories.{ts,tsx}',
    
    // Configuration entry points for tools
    'components.json', // shadcn/ui config
  ],

  // Define project files to analyze (exclude test files from unused export detection)
  project: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.stories.{ts,tsx}',
  ],

  // === IGNORE PATTERNS ===
  ignore: [
    // Environment and build artifacts
    'src/vite-env.d.ts',
    'dist/**',
    'build/**',
    'coverage/**',
    'node_modules/**',
    '.git/**',
    '.cache/**',
    '.turbo/**',
    
    // OS files
    '**/.DS_Store',
    
    // IDE files
    '.vscode/**',
    '.cursor/**',
    
    // Generated types that may appear unused
    'src/integrations/supabase/types.ts', // Contains generated DB types
    
    // Utility files that export many functions for potential use
    'src/lib/utils/shared.ts', // Re-export utility hub
    'src/types/index.ts', // Main type export hub
  ],

  // === DEPENDENCY CONFIGURATION ===
  // Ignore dependencies that are used indirectly or by tooling
  ignoreDependencies: [
    // Vite plugins and build tools (used in config files)
    '@vitejs/plugin-react-swc',
    'lovable-tagger',
    'autoprefixer',
    'postcss',
    
    // Testing utilities (used in config/setup)
    '@testing-library/jest-dom',
    'jsdom',
    '@vitest/coverage-v8',
    
    // Type-only dependencies
    '@types/node',
    '@types/react',
    '@types/react-dom',
    
    // ESLint plugins (used in eslint.config.js)
    '@eslint/js',
    'globals',
    'eslint-plugin-*',
    'typescript-eslint',
    
    // shadcn/ui peer dependencies that may not be directly imported
    '@radix-ui/react-*',
    'class-variance-authority',
    'tailwind-merge',
    'tailwindcss-animate',
    
    // Supabase CLI (if used for migrations)
    'supabase',
  ],

  // Don't warn about these binaries
  ignoreBinaries: [
    'supabase', // Used for database management
    'vite', // Used in package.json scripts
    'vitest', // Used in package.json scripts
  ],

  // === TOOL-SPECIFIC CONFIGURATIONS ===
  
  // Vite configuration
  vite: {
    config: 'vite.config.ts',
    entry: [
      'src/main.tsx',
      'index.html',
    ],
  },

  // Vitest configuration  
  vitest: {
    config: 'vite.config.ts', // Vitest config is in vite.config.ts
    entry: [
      'src/test/setup.ts',
      'src/test/integration/setup.ts',
    ],
  },

  // ESLint configuration
  eslint: {
    config: 'eslint.config.js',
    entry: ['eslint.config.js'],
  },

  // Tailwind CSS configuration
  tailwind: {
    config: 'tailwind.config.ts',
    entry: ['tailwind.config.ts'],
  },

  // PostCSS configuration
  postcss: {
    config: 'postcss.config.js',
  },

  // === ADDITIONAL IGNORE PATTERNS ===
  
  // Ignore exports that are used within the same file (common pattern for utilities)
  ignoreExportsUsedInFile: true,
};

export default config;
