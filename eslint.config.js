import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import tailwindcss from 'eslint-plugin-tailwindcss';
import promise from 'eslint-plugin-promise';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '*.config.js'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      tailwindcss: tailwindcss,
      promise: promise,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      tailwindcss: {
        // Allow shadcn/ui custom classes and components
        callees: ['cn', 'clsx', 'cva', 'twMerge'],
        config: './tailwind.config.js',
      },
    },
    rules: {
      // React Rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // React Specific
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/prop-types': 'off', // Using TypeScript
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript Rules - Enhanced Strict Mode
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-require-imports': 'error',

      // Import Rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-default-export': 'off', // Allow default exports for React components

      // Tailwind CSS Rules
      'tailwindcss/classnames-order': 'off', // Disabled: Let Prettier handle class ordering
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-custom-classname': 'off', // Allow shadcn/ui custom classes
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/migration-from-tailwind-2': 'off',
      'tailwindcss/no-arbitrary-value': 'off', // Allow arbitrary values for flexibility
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',

      // Promise/Async Rules for TanStack Query patterns
      ...promise.configs.recommended.rules,
      'promise/always-return': 'off', // Not needed with TypeScript
      'promise/catch-or-return': ['error', { allowFinally: true }],
      'promise/prefer-await-to-then': 'warn',
      'promise/prefer-await-to-callbacks': 'warn',
    },
  },
  // Specific overrides for test files
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/test/**/*.{ts,tsx}',
      '**/tests/**/*.{ts,tsx}',
    ],
    rules: {
      // Relax rules for test files
      '@typescript-eslint/no-empty-function': 'off', // Allow empty mocks
      '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow non-null assertions in tests
      'react-refresh/only-export-components': 'off', // Allow test helpers
    },
  },
  // Specific overrides for type definition files
  {
    files: ['**/*.types.{ts,tsx}', '**/types/**/*.{ts,tsx}'],
    rules: {
      // Type definition files may have unused exports for external consumption
      '@typescript-eslint/no-unused-vars': 'off',
      'import/no-unused-modules': 'off',
    },
  },
  // Specific overrides for configuration files
  {
    files: ['**/setup.ts', '**/config.ts', '**/*.config.{ts,js}'],
    rules: {
      // Configuration files may need require imports and empty functions
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  }
);
