import path from "path";

import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Phase 3: Enhanced build optimization
    sourcemap: mode === "development" ? true : false,
    rollupOptions: {
      output: {
        // Phase 3.1: Improved chunking strategy for optimal caching and lazy loading
        manualChunks(id) {
          // Vendor chunks - Most stable, cache-friendly
          if (id.includes('node_modules')) {
            // React ecosystem - Core framework
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // UI libraries - Heavy but stable
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Data/State management - API layer
            if (id.includes('@tanstack') || id.includes('@supabase')) {
              return 'data-vendor';
            }
            // Router and form libraries
            if (id.includes('react-router') || id.includes('zod') || id.includes('date-fns')) {
              return 'utils-vendor';
            }
            // Animation and UI utilities
            if (id.includes('@react-spring') || id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'animation-vendor';
            }
            // Other vendors
            return 'vendor';
          }
          
          // Feature-based chunks - Lazy loaded by default
          if (id.includes('/src/features/')) {
            const feature = id.split('/src/features/')[1].split('/')[0];
            // Further split large features
            if (feature === 'tasks') {
              if (id.includes('/hooks/')) return 'feature-tasks-hooks';
              if (id.includes('/components/')) return 'feature-tasks-components';
              if (id.includes('/forms/')) return 'feature-tasks-forms';
              return 'feature-tasks-core';
            }
            return `feature-${feature}`;
          }
          
          // Shared library chunks - Optimize by usage frequency
          if (id.includes('/src/lib/')) {
            if (id.includes('/api/')) return 'lib-api';
            if (id.includes('/utils/')) return 'lib-utils';
            if (id.includes('/performance/')) return 'lib-performance';
            return 'lib-shared';
          }
          
          // Component chunks - Split by usage patterns
          if (id.includes('/src/components/')) {
            if (id.includes('/ui/')) {
              if (id.includes('/loading/')) return 'ui-loading';
              if (id.includes('/form/')) return 'ui-forms';
              return 'ui-components';
            }
            if (id.includes('/layout/')) return 'layout-components';
            if (id.includes('/debug/')) return 'debug-components';
            return 'shared-components';
          }
        },
        chunkFileNames: (chunkInfo) => {
          // More descriptive chunk names for debugging
          const facadeModuleId = chunkInfo.facadeModuleId;
          if (facadeModuleId) {
            const name = path.basename(facadeModuleId, path.extname(facadeModuleId));
            return `chunks/${name}-[hash].js`;
          }
          return `chunks/[name]-[hash].js`;
        },
        entryFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
    // Performance optimization
    target: 'esnext',
    minify: 'esbuild',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  // Phase 3: Performance monitoring in dev mode
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".git", ".cache", "**/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover", "json"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules",
        "src/test/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "**/dist/**",
        "**/.{eslint,prettier}rc.{js,cjs,yml}",
        "**/vite.config.*",
        "**/vitest.config.*",
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80,
        },
        // Critical modules should have higher coverage
        "src/lib/api/**": {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
        "src/hooks/**": {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85,
        },
        "src/features/**/hooks/**": {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85,
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: "threads",
    poolOptions: {
      threads: {
        isolate: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },
    server: {
      deps: {
        inline: false,
      },
    },
    sourcemap: true,
  },
}));
