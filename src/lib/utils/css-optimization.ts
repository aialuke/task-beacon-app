
/**
 * CSS Optimization Utilities
 * 
 * Utilities for optimizing CSS delivery and reducing bundle size.
 */

/**
 * Preload critical CSS for faster rendering
 */
export function preloadCriticalCSS(): void {
  // Critical CSS is already inlined in index.html
  // This function can be used for additional optimizations
  
  // Preload font files
  const fonts = [
    '/fonts/inter-var.woff2',
    '/fonts/inter-var-latin.woff2',
  ];
  
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Load non-critical CSS asynchronously
 */
export function loadNonCriticalCSS(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // Load as print stylesheet first
    link.onload = () => {
      link.media = 'all'; // Switch to all media
      resolve();
    };
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * Remove unused CSS classes (simple implementation)
 */
export function removeUnusedCSS(): void {
  // This would typically be done at build time
  // For runtime, we can remove specific classes that are no longer needed
  const unusedClasses = [
    'legacy-button',
    'old-card-style',
    'deprecated-layout',
  ];
  
  unusedClasses.forEach(className => {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => { el.classList.remove(className); });
  });
}

/**
 * Optimize CSS animations for performance
 */
export function optimizeAnimations(): void {
  // Respect user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0ms');
    document.documentElement.style.setProperty('--transition-duration', '0ms');
  }
}
