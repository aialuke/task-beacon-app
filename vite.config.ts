
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
