/**
 * Performance Monitor - Phase 3 Long-term Optimization
 * 
 * Tracks and reports performance metrics for the application
 */

import React from 'react';

import { logger } from '@/lib/logger';

interface PerformanceMetrics {
  routeChanges: Record<string, number[]>;
  componentRenders: Record<string, number>;
  apiCalls: Record<string, { duration: number; timestamp: number }[]>;
  bundleLoads: Record<string, number>;
}

interface NavigationTiming {
  route: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    routeChanges: {},
    componentRenders: {},
    apiCalls: {},
    bundleLoads: {},
  };

  private navigationStart = 0;
  private currentRoute = '';

  constructor() {
    this.init();
  }

  private init() {
    // Only run in development or when explicitly enabled
    if (import.meta.env.DEV || localStorage.getItem('perf-monitor') === 'true') {
      this.setupPerformanceObserver();
      this.setupNavigationTracking();
      this.startReporting();
    }
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Track resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.trackResourceLoad(entry as PerformanceResourceTiming);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Track navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.trackNavigationTiming(entry as PerformanceNavigationTiming);
          }
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
    }
  }

  private setupNavigationTracking() {
    // Track route changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      this.onRouteChange();
      return originalPushState.apply(history, args);
    };

    history.replaceState = (...args) => {
      this.onRouteChange();
      return originalReplaceState.apply(history, args);
    };

    window.addEventListener('popstate', () => {
      this.onRouteChange();
    });

    // Initial route
    this.onRouteChange();
  }

  private onRouteChange() {
    const newRoute = window.location.pathname;
    const now = performance.now();

    if (this.navigationStart && this.currentRoute) {
      const duration = now - this.navigationStart;
      this.trackRouteChange(this.currentRoute, newRoute, duration);
    }

    this.currentRoute = newRoute;
    this.navigationStart = now;
  }

  private trackResourceLoad(entry: PerformanceResourceTiming) {
    const resourceType = this.getResourceType(entry.name);
    const duration = entry.responseEnd - entry.requestStart;

    if (resourceType === 'chunk') {
      const chunkName = this.extractChunkName(entry.name);
      this.metrics.bundleLoads[chunkName] = duration;
    }
  }

  private trackNavigationTiming(entry: PerformanceNavigationTiming) {
    const timing = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      firstPaint: 0,
      firstContentfulPaint: 0,
    };

    // Get paint timings if available
    const paintTimings = performance.getEntriesByType('paint');
    paintTimings.forEach((paint) => {
      if (paint.name === 'first-paint') {
        timing.firstPaint = paint.startTime;
      } else if (paint.name === 'first-contentful-paint') {
        timing.firstContentfulPaint = paint.startTime;
      }
    });

    logger.info('Navigation timing:', timing);
  }

  private getResourceType(url: string): string {
    if (url.includes('/chunks/') || url.includes('hash')) return 'chunk';
    if (url.endsWith('.js')) return 'script';
    if (url.endsWith('.css')) return 'style';
    if (url.includes('api') || url.includes('supabase')) return 'api';
    return 'other';
  }

  private extractChunkName(url: string): string {
    const match = url.match(/\/chunks\/([^-]+)/);
    return match ? match[1] : 'unknown';
  }

  // Public API methods
  public startRouteNavigation(route: string) {
    this.navigationStart = performance.now();
    this.currentRoute = route;
  }

  public trackRouteChange(fromRoute: string, toRoute: string, duration: number) {
    if (!this.metrics.routeChanges[toRoute]) {
      this.metrics.routeChanges[toRoute] = [];
    }
    this.metrics.routeChanges[toRoute].push(duration);

    logger.info('Route change performance:', {
      from: fromRoute,
      to: toRoute,
      duration: Math.round(duration),
      unit: 'ms'
    });
  }

  public trackComponentRender(componentName: string) {
    this.metrics.componentRenders[componentName] = 
      (this.metrics.componentRenders[componentName] || 0) + 1;
  }

  public trackApiCall(endpoint: string, duration: number) {
    if (!this.metrics.apiCalls[endpoint]) {
      this.metrics.apiCalls[endpoint] = [];
    }
    this.metrics.apiCalls[endpoint].push({
      duration,
      timestamp: Date.now(),
    });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getRoutePerformance(route: string) {
    const routeTimings = this.metrics.routeChanges[route] || [];
    if (routeTimings.length === 0) return null;

    const avg = routeTimings.reduce((sum, time) => sum + time, 0) / routeTimings.length;
    const min = Math.min(...routeTimings);
    const max = Math.max(...routeTimings);

    return {
      route,
      count: routeTimings.length,
      average: Math.round(avg),
      min: Math.round(min),
      max: Math.round(max),
      recent: routeTimings.slice(-5).map(t => Math.round(t)),
    };
  }

  public getSlowRoutes(threshold = 1000): { route: string; avgDuration: number }[] {
    const slowRoutes: { route: string; avgDuration: number }[] = [];

    Object.entries(this.metrics.routeChanges).forEach(([route, timings]) => {
      const avg = timings.reduce((sum, time) => sum + time, 0) / timings.length;
      if (avg > threshold) {
        slowRoutes.push({ route, avgDuration: Math.round(avg) });
      }
    });

    return slowRoutes.sort((a, b) => b.avgDuration - a.avgDuration);
  }

  private startReporting() {
    // Report performance metrics every 30 seconds in development
    if (import.meta.env.DEV) {
      setInterval(() => {
        this.reportMetrics();
      }, 30000);
    }
  }

  private reportMetrics() {
    const slowRoutes = this.getSlowRoutes(500); // Routes taking > 500ms
    
    if (slowRoutes.length > 0) {
      logger.warn('Slow routes detected:', { slowRoutes });
    }

    // Report bundle load times
    const heavyBundles = Object.entries(this.metrics.bundleLoads)
      .filter(([_, duration]) => duration > 200)
      .sort(([, a], [, b]) => b - a);

    if (heavyBundles.length > 0) {
      logger.warn('Heavy bundles detected:', { heavyBundles });
    }

    // Report frequently rendering components
    const frequentComponents = Object.entries(this.metrics.componentRenders)
      .filter(([_, count]) => count > 10)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (frequentComponents.length > 0) {
      logger.info('Frequently rendering components:', { frequentComponents });
    }
  }

  public exportMetrics(): string {
    const report = {
      timestamp: new Date().toISOString(),
      routes: Object.entries(this.metrics.routeChanges).map(([route, timings]) => ({
        route,
        ...this.getRoutePerformance(route),
      })),
      slowRoutes: this.getSlowRoutes(500),
      bundleLoads: this.metrics.bundleLoads,
      componentRenders: this.metrics.componentRenders,
    };

    return JSON.stringify(report, null, 2);
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component render tracking
export function usePerformanceTracking(componentName: string) {
  const trackRender = () => {
    performanceMonitor.trackComponentRender(componentName);
  };

  // Track render on mount and updates
  React.useEffect(() => {
    trackRender();
  });

  return { trackRender };
}

// Utility for API call tracking
export function withApiTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  endpoint: string
): T {
  return (async (...args: Parameters<T>) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      performanceMonitor.trackApiCall(endpoint, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.trackApiCall(`${endpoint} (error)`, duration);
      throw error;
    }
  }) as T;
} 