
import { useEffect } from 'react';
import { preloadCriticalCSS, optimizeAnimations } from '@/lib/utils/css-optimization';

/**
 * Hook for applying bundle and performance optimizations
 */
export function useBundleOptimization() {
  useEffect(() => {
    // Apply CSS optimizations
    preloadCriticalCSS();
    optimizeAnimations();
    
    // Preload critical routes
    const criticalRoutes = [
      '/auth',
      '/tasks',
      '/create-task',
    ];
    
    // Preload route components after initial load
    const preloadRoutes = () => {
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };
    
    // Delay preloading to not interfere with critical resources
    const timeoutId = setTimeout(preloadRoutes, 2000);
    
    return () => clearTimeout(timeoutId);
  }, []);
}
