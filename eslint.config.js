import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import mobileFirst from './eslint-plugin-mobile-first.js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'dist',
      'node_modules',
      '*.config.js',
      'coverage',
      'build',
      '.vite',
      'backup-*',
      '*.generated.*',
      'knip.config.ts',
      'tailwind.config.ts',
      'vite.config.ts',
    ],
  },

  // Main configuration for TypeScript files
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024, // Updated for React 19 features
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'mobile-first': mobileFirst,
    },
    settings: {
      react: {
        version: 'detect',
        // React 19 specific settings
        formComponents: ['Form'],
        linkComponents: [
          { name: 'Link', linkAttribute: 'to' },
          { name: 'NavLink', linkAttribute: 'to' },
        ],
      },
    },
    rules: {
      // React Rules - Enhanced for React 19
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // React 19 Specific Rules
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/prop-types': 'off', // Using TypeScript
      'react/jsx-uses-react': 'off', // React 17+
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
      'react/hook-use-state': 'warn', // React 19 hook optimization

      // React Refresh - Updated for React 19 patterns
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'createContext',
            'useContext',
            'Provider',
            'Consumer',
            'action', // React 19 server actions
            'loader', // React 19 data loading
            'meta', // Metadata exports
            'config', // Configuration exports
          ],
        },
      ],

      // TypeScript Rules - Enhanced for React 19 + Modern Patterns
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern:
            '^_|^(use[A-Z].*|create[A-Z].*|generate|format|parse|is|has|can|should|get|transform|validate)',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Enhanced TypeScript rules for React 19 patterns
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      // Performance and best practices (non-type-checked)
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-string-starts-ends-with': 'warn',

      // Accessibility - Enhanced
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['to'],
        },
      ],
      'jsx-a11y/no-autofocus': 'off', // React 19 has better autofocus handling

      // Mobile-First Interactive Feedback Rules
      'mobile-first/hover-without-active': [
        'error',
        {
          requireFocusVisible: true,
          requireActive: true,
          allowExceptions: [
            'hover:scale-*', // Scale transformations might not need active states
            'hover:rotate-*', // Rotation transformations might not need active states
            'hover:transform', // Generic transform states
          ],
        },
      ],
    },
  },

  // Configuration for test files
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/test/**/*.{ts,tsx}',
      '**/tests/**/*.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
      '**/setup.ts',
      '**/test-utils.tsx',
    ],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'react-refresh/only-export-components': 'off',
      'jsx-a11y/no-autofocus': 'off',
    },
  },

  // Configuration for utility and type files
  {
    files: [
      '**/types/**/*.{ts,tsx}',
      '**/utils/**/*.{ts,tsx}',
      '**/*.d.ts',
      '**/context/**/*.{ts,tsx}',
      '**/*Context.{ts,tsx}',
      '**/lib/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Utilities may need any types
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|.*',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },

  // Configuration for configuration files
  {
    files: [
      '**/*.config.{ts,js,mjs}',
      '**/vite.config.ts',
      '**/tailwind.config.ts',
      '**/postcss.config.js',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },

  // Configuration for actions and server-side code (React 19)
  {
    files: [
      '**/actions/**/*.{ts,tsx}',
      '**/lib/actions/**/*.{ts,tsx}',
      '**/*Action.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Server actions may need any for FormData
      '@typescript-eslint/no-floating-promises': 'off', // Server actions handle promises differently
    },
  },

  // Prettier integration - MUST be last to override formatting rules
  eslintConfigPrettier,
);
