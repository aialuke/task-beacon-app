export default {
  plugins: {
    tailwindcss: {},
    "@fullhuman/postcss-purgecss": {
      content: [
        "./src/**/*.{ts,tsx,js,jsx}",
        "./public/index.html",
        "./src/styles/**/*.{css}",
      ],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [
          "html",
          "body",
          "loading-spinner",
          "timer-container",
          "timer-ring",
          "timer-progress",
          "timer-text",
          "loading-unified-spinner",
          "shadow-unified-sm",
          "shadow-unified-md",
          "shadow-unified-lg",
          "shadow-unified-focus",
          "will-change-unified",
          "gpu-accelerated-unified",
          "optimize-rendering-unified",
        ],
        greedy: [/^task-/, /^status-/, /data-status/, /^virtualized-task-/],
      },
    },
    autoprefixer: {},
  },
};
