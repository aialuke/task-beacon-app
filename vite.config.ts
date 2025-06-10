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
    // Simplified build configuration
    sourcemap: mode === "development",
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Simple chunking strategy - only vendor separation
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom'],
          // UI components
          'ui-vendor': ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-slot', '@radix-ui/react-tooltip', '@radix-ui/react-visually-hidden', 'lucide-react'],
          // Data management
          'data-vendor': ['@tanstack/react-query', '@supabase/supabase-js'],
          // Other utilities
          'utils-vendor': ['react-router-dom', 'zod', 'clsx', 'class-variance-authority', 'tailwind-merge'],
        }
      },
    },
  },
  // Remove console logs in production
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
      reporter: ["text", "html"],
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
          statements: 70,
          branches: 65,
          functions: 70,
          lines: 70,
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
        maxThreads: 2, // Reduced for stability
      },
    },
    sourcemap: true,
  },
}));
