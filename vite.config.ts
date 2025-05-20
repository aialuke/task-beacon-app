
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
  plugins: [
    react({
      // Remove the fastRefresh option as it's not recognized in the current type
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@/components/ui'],
        },
      },
    },
  },
  // Optimize CSS
  css: {
    devSourcemap: mode === 'development',
    postcss: {
      plugins: [],
    },
  },
}));
