
/**
 * Asset Optimization Utilities
 * 
 * Utilities for optimizing images, fonts, and other assets.
 */

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
  width?: number;
  height?: number;
}

/**
 * Generate optimized image URL with query parameters
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  const {
    quality = 85,
    format = 'auto',
    width,
    height,
  } = options;
  
  // If it's already an optimized URL or external URL, return as-is
  if (src.includes('?') || src.startsWith('http')) {
    return src;
  }
  
  const params = new URLSearchParams();
  
  if (quality !== 85) params.append('q', quality.toString());
  if (format !== 'auto') params.append('f', format);
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  
  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

/**
 * Generate responsive image srcSet
 */
export function generateSrcSet(src: string, widths: number[]): string {
  return widths
    .map(width => `${getOptimizedImageUrl(src, { width })} ${width}w`)
    .join(', ');
}

/**
 * Generate responsive sizes attribute
 */
export function generateSizes(breakpoints: Array<{ condition: string; size: string }>): string {
  return breakpoints
    .map(({ condition, size }) => `${condition} ${size}`)
    .join(', ');
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(images: string[]): void {
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyLoading(): void {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px',
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Optimize font loading
 */
export function optimizeFontLoading(): void {
  // Add font-display: swap to improve perceived performance
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}
