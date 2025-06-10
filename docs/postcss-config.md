# PostCSS Configuration Guide

## Overview

This project uses an optimized PostCSS configuration designed for maximum performance with Vite, full Tailwind CSS support, and seamless integration with shadcn/ui components.

## Configuration Details

### Core Plugins

#### 1. **Tailwind CSS** 
- **Purpose**: Primary utility-first CSS framework
- **Priority**: Must run first in the pipeline
- **Integration**: 
  - Works with `tailwind-merge` for class merging
  - Supports all shadcn/ui components
  - Processes custom Tailwind config with dark mode support

#### 2. **PostCSS Preset Env**
- **Purpose**: Modern CSS features with automatic polyfills
- **Stage**: Stage 2 (stable CSS proposals)
- **Features Enabled**:
  - CSS Nesting (useful for component styling)
  - Custom Media Queries (responsive design)
  - Color Functional Notation (theming support)
- **Browser Targets**: `last 2 versions, not dead, > 0.2%`

#### 3. **Autoprefixer**
- **Purpose**: Vendor prefix management
- **Configuration**:
  - Flexbox: Modern syntax only (`no-2009`)
  - Grid: Auto-placement support
  - Removes outdated prefixes for clean output

## Performance Optimizations

### What's Included ✅
- **Tailwind CSS**: Essential for utility classes and shadcn/ui
- **Modern CSS Features**: Stage 2+ proposals with polyfills
- **Vendor Prefixes**: Cross-browser compatibility
- **Optimized Processing**: Minimal dev overhead, full production optimization

### What's Excluded ❌
- **postcss-import**: Vite handles CSS imports natively
- **cssnano**: Vite minifies CSS automatically in production
- **postcss-url**: Vite processes asset URLs and imports
- **Unused CSS Plugins**: Keeps the pipeline fast and conflict-free

## Browser Support

Target browsers based on modern standards:
```
last 2 versions
not dead
> 0.2%
not op_mini all
```

This ensures:
- Modern browser support (Chrome 100+, Firefox 100+, Safari 15+)
- Excludes legacy browsers that require extensive polyfills
- Optimal bundle size vs. compatibility balance

## Development vs Production

### Development Mode
- **Fast Processing**: Minimal transformations for speed
- **Live Reload**: Changes processed instantly
- **Source Maps**: Full debugging support

### Production Mode
- **Full Optimization**: All prefixes and polyfills applied
- **Clean Output**: Removes unnecessary prefixes
- **Cross-browser Compatibility**: Ensures broad browser support

## Tailwind Integration

### CSS Variables Support
The configuration supports Tailwind's CSS custom properties used in the theme:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... */
}
```

### Dark Mode
Fully compatible with Tailwind's class-based dark mode:
```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  // ...
}
```

### shadcn/ui Components
Optimized for shadcn/ui component styling:
- Supports CSS variable theming
- Compatible with `cn()` utility (clsx + tailwind-merge)
- Handles component animations and transitions

## Required Dependencies

Add to your `package.json`:

```json
{
  "devDependencies": {
    "postcss": "^8.5.4",
    "postcss-preset-env": "^10.1.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^3.4.17"
  }
}
```

## Installation

```bash
npm install -D postcss-preset-env
```

The other dependencies are already included in the project.

## Troubleshooting

### Common Issues

1. **CSS not being processed**
   - Ensure Vite can find `postcss.config.js` in the project root
   - Check that CSS files are imported correctly in your components

2. **Tailwind classes not working**
   - Verify `tailwind.config.ts` content paths include your files
   - Check that components are using the correct class names

3. **Build errors**
   - Ensure all PostCSS plugins are installed
   - Check for conflicts with other CSS processing tools

### Debugging

Enable verbose PostCSS logging:
```bash
DEBUG=postcss* npm run build
```

Check processed CSS output:
```bash
npm run build:dev
```

## Best Practices

1. **Import Order**: Import CSS files at the top of your components
2. **Custom CSS**: Place custom styles in separate CSS files
3. **Tailwind First**: Use Tailwind utilities before custom CSS
4. **Component Styling**: Use CSS modules or styled-components for complex component styling

## Performance Monitoring

The configuration is optimized for the project's performance monitoring system:
- Minimal processing overhead in development
- Optimized output for production bundles
- Compatible with Vite's build analysis tools

Use the performance scripts to monitor impact:
```bash
npm run build:analyze
npm run perf:bundle-size
``` 