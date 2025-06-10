/**
 * PostCSS Configuration - Optimized for Vite + Tailwind + shadcn/ui
 * 
 * Modern, streamlined configuration that focuses on:
 * - Fast development builds
 * - Essential browser compatibility
 * - Full Tailwind CSS + shadcn/ui support
 * - Vite-optimized processing pipeline
 */

export default {
  plugins: {
    /**
     * Tailwind CSS - Core utility framework
     * Essential for all Tailwind utilities and shadcn/ui components
     */
    tailwindcss: {},

    /**
     * Autoprefixer - Cross-browser compatibility
     * Automatically adds vendor prefixes for CSS properties
     * Configured for modern browser support (last 2 versions)
     */
    autoprefixer: {
      // Modern flexbox support (no IE9 legacy)
      flexbox: 'no-2009',
      
      // CSS Grid with autoplace support
      grid: 'autoplace',
      
      // Remove outdated prefixes for cleaner output
      remove: true,
      
      // Target modern browsers (matches Vite defaults)
      overrideBrowserslist: [
        'last 2 versions',
        'not dead',
        '> 0.2%',
        'not IE 11'
      ],
    },

    /**
     * PostCSS Preset Env - Modern CSS features
     * Enables future CSS syntax with polyfills for current browsers
     * Stage 2: Stable, widely-implemented features only
     */
    'postcss-preset-env': {
      // Stage 2: Stable CSS features
      stage: 2,
      
      // Minimal feature set for performance
      features: {
        // Native CSS custom properties support
        'custom-properties': false,
        
        // CSS nesting (useful for component styles)
        'nesting-rules': true,
        
        // Modern color functions
        'color-functional-notation': true,
        
        // Disable features that may conflict with Tailwind
        'logical-properties-and-values': false,
        'custom-media-queries': false,
      },
      
      // Autoprefixer handled separately for better control
      autoprefixer: false,
      
      // Modern browser targets
      browsers: 'last 2 versions, not dead, > 0.2%',
    },
  },
};
