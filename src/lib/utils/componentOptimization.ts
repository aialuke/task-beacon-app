/**
 * Component Optimization Utilities
 * 
 * Advanced performance optimization patterns and utilities for React components.
 * Provides sophisticated memoization, optimization analysis, and performance patterns.
 */

import React, { memo, ComponentType, useMemo, useRef, useEffect } from 'react';
import { performanceMonitor } from './performance';

// === ADVANCED MEMOIZATION PATTERNS ===

/**
 * Enhanced memo with performance tracking and optimization insights
 */
export function optimizedMemo<P>(
  Component: ComponentType<P>,
  options?: {
    name?: string;
    compareFunction?: (prevProps: P, nextProps: P) => boolean;
    trackPerformance?: boolean;
    optimizationLevel?: 'basic' | 'advanced' | 'aggressive';
  }
): React.MemoExoticComponent<ComponentType<P>> {
  const {
    name = Component.displayName || Component.name || 'Unknown',
    compareFunction,
    trackPerformance = true,
    optimizationLevel = 'basic'
  } = options || {};

  // Enhanced comparison function based on optimization level
  const enhancedCompare = (prevProps: P, nextProps: P): boolean => {
    if (compareFunction) {
      return compareFunction(prevProps, nextProps);
    }

    switch (optimizationLevel) {
      case 'basic':
        return shallowEqual(prevProps, nextProps);
      
      case 'advanced':
        return advancedEqual(prevProps, nextProps);
      
      case 'aggressive':
        return deepEqual(prevProps, nextProps);
      
      default:
        return shallowEqual(prevProps, nextProps);
    }
  };

  const OptimizedComponent = memo(Component, (prevProps, nextProps) => {
    const isEqual = enhancedCompare(prevProps, nextProps);
    
    if (trackPerformance) {
      const changeCount = Object.keys(nextProps as any).filter(
        key => (prevProps as any)[key] !== (nextProps as any)[key]
      ).length;
      
      if (!isEqual && changeCount > 0) {
        console.debug(`🔄 ${name} props changed:`, {
          changedProps: changeCount,
          totalProps: Object.keys(nextProps as any).length,
          changeRatio: `${((changeCount / Object.keys(nextProps as any).length) * 100).toFixed(1)}%`
        });
      }
    }
    
    return isEqual;
  });

  OptimizedComponent.displayName = `Optimized(${name})`;
  return OptimizedComponent;
}

/**
 * Shallow equality comparison
 */
function shallowEqual(prevProps: any, nextProps: any): boolean {
  const keys1 = Object.keys(prevProps);
  const keys2 = Object.keys(nextProps);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => prevProps[key] === nextProps[key]);
}

/**
 * Advanced equality with smart type checking
 */
function advancedEqual(prevProps: any, nextProps: any): boolean {
  const keys1 = Object.keys(prevProps);
  const keys2 = Object.keys(nextProps);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => {
    const prev = prevProps[key];
    const next = nextProps[key];
    
    // Handle functions
    if (typeof prev === 'function' && typeof next === 'function') {
      return prev.toString() === next.toString();
    }
    
    // Handle arrays (shallow comparison)
    if (Array.isArray(prev) && Array.isArray(next)) {
      return prev.length === next.length && 
             prev.every((item, index) => item === next[index]);
    }
    
    // Handle objects (shallow comparison)
    if (prev && next && typeof prev === 'object' && typeof next === 'object') {
      return shallowEqual(prev, next);
    }
    
    return prev === next;
  });
}

/**
 * Deep equality comparison (use sparingly)
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => deepEqual(a[key], b[key]));
  }
  
  return false;
}

// === PERFORMANCE OPTIMIZATION HOCs ===

/**
 * HOC for automatic performance optimization
 */
export function withAutoOptimization<P extends Record<string, any>>(
  Component: ComponentType<P>,
  options?: {
    memoization?: boolean;
    performanceTracking?: boolean;
    renderOptimization?: boolean;
    errorBoundary?: boolean;
  }
): ComponentType<P> {
  const {
    memoization = true,
    performanceTracking = true,
    renderOptimization = true,
    errorBoundary = false
  } = options || {};

  let OptimizedComponent: any = Component;

  // Apply memoization
  if (memoization) {
    OptimizedComponent = optimizedMemo(OptimizedComponent, {
      optimizationLevel: 'advanced',
      trackPerformance: performanceTracking
    });
  }

  // Apply render optimization
  if (renderOptimization) {
    OptimizedComponent = withRenderOptimization(OptimizedComponent);
  }

  return OptimizedComponent;
}

/**
 * HOC for render optimization
 */
function withRenderOptimization<P extends Record<string, any>>(
  Component: ComponentType<P>
): ComponentType<P> {
  const RenderOptimizedComponent = (props: P) => {
    const renderStartRef = useRef<number>(0);
    const renderCountRef = useRef<number>(0);

    // Track render start
    renderStartRef.current = performance.now();
    renderCountRef.current++;

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        const componentName = Component.displayName || Component.name || 'Unknown';
        console.debug(`🧹 Unmounting ${componentName} after ${renderCountRef.current} renders`);
      };
    }, []);

    // Track render completion
    useEffect(() => {
      const renderDuration = performance.now() - renderStartRef.current;
      const componentName = Component.displayName || Component.name || 'Unknown';
      
      if (renderDuration > 16) {
        console.warn(`🐌 Slow render in ${componentName}: ${renderDuration.toFixed(2)}ms`);
      }
      
      performanceMonitor.trackComponentRender(componentName, renderDuration);
    });

    return React.createElement(Component, props);
  };

  RenderOptimizedComponent.displayName = `RenderOptimized(${Component.displayName || Component.name})`;
  return RenderOptimizedComponent;
}

// === COMPONENT ANALYSIS UTILITIES ===

/**
 * Analyze component performance and provide optimization suggestions
 */
export class ComponentAnalyzer {
  private static instance: ComponentAnalyzer;
  private componentMetrics = new Map<string, ComponentMetrics>();

  static getInstance(): ComponentAnalyzer {
    if (!ComponentAnalyzer.instance) {
      ComponentAnalyzer.instance = new ComponentAnalyzer();
    }
    return ComponentAnalyzer.instance;
  }

  trackComponent(name: string, renderTime: number, propsChanged: boolean): void {
    const existing = this.componentMetrics.get(name) || {
      name,
      totalRenders: 0,
      totalRenderTime: 0,
      averageRenderTime: 0,
      propsChangeCount: 0,
      slowRenders: 0,
      lastOptimizationSuggestion: 0
    };

    existing.totalRenders++;
    existing.totalRenderTime += renderTime;
    existing.averageRenderTime = existing.totalRenderTime / existing.totalRenders;
    
    if (propsChanged) {
      existing.propsChangeCount++;
    }
    
    if (renderTime > 16) {
      existing.slowRenders++;
    }

    this.componentMetrics.set(name, existing);

    // Provide optimization suggestions (throttled)
    const now = Date.now();
    if (now - existing.lastOptimizationSuggestion > 30000) { // 30 seconds
      this.suggestOptimizations(name, existing);
      existing.lastOptimizationSuggestion = now;
    }
  }

  private suggestOptimizations(name: string, metrics: ComponentMetrics): void {
    const suggestions: string[] = [];

    // High average render time
    if (metrics.averageRenderTime > 10) {
      suggestions.push('Consider using React.memo() or optimizing render logic');
    }

    // Frequent re-renders with few prop changes
    const propsChangeRatio = metrics.propsChangeCount / metrics.totalRenders;
    if (metrics.totalRenders > 10 && propsChangeRatio < 0.3) {
      suggestions.push('Many re-renders without prop changes - check parent component optimization');
    }

    // Many slow renders
    const slowRenderRatio = metrics.slowRenders / metrics.totalRenders;
    if (slowRenderRatio > 0.2) {
      suggestions.push('Frequent slow renders detected - consider code splitting or virtualization');
    }

    if (suggestions.length > 0) {
      console.group(`💡 Optimization suggestions for ${name}`);
      console.log('Performance metrics:', {
        totalRenders: metrics.totalRenders,
        averageRenderTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
        propsChangeRatio: `${(propsChangeRatio * 100).toFixed(1)}%`,
        slowRenderRatio: `${(slowRenderRatio * 100).toFixed(1)}%`
      });
      suggestions.forEach(suggestion => console.log(`• ${suggestion}`));
      console.groupEnd();
    }
  }

  getReport(): ComponentOptimizationReport {
    const components = Array.from(this.componentMetrics.values())
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime);

    return {
      totalComponents: components.length,
      slowestComponents: components.slice(0, 5),
      mostActiveComponents: components
        .sort((a, b) => b.totalRenders - a.totalRenders)
        .slice(0, 5),
      optimizationCandidates: components.filter(c => 
        c.averageRenderTime > 10 || c.slowRenders / c.totalRenders > 0.2
      )
    };
  }

  clear(): void {
    this.componentMetrics.clear();
  }
}

// === INTERFACES ===

interface ComponentMetrics {
  name: string;
  totalRenders: number;
  totalRenderTime: number;
  averageRenderTime: number;
  propsChangeCount: number;
  slowRenders: number;
  lastOptimizationSuggestion: number;
}

interface ComponentOptimizationReport {
  totalComponents: number;
  slowestComponents: ComponentMetrics[];
  mostActiveComponents: ComponentMetrics[];
  optimizationCandidates: ComponentMetrics[];
}

// === ADVANCED HOOKS ===

/**
 * Enhanced useMemo with automatic optimization detection
 */
export function useSmartMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options?: {
    name?: string;
    maxCacheSize?: number;
    ttl?: number;
  }
): T {
  const { name = 'smart-memo', maxCacheSize = 10, ttl } = options || {};
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const computationTimeRef = useRef<number[]>([]);

  return useMemo(() => {
    const key = JSON.stringify(deps);
    const cache = cacheRef.current;
    const now = Date.now();

    // Check cache first
    const cached = cache.get(key);
    if (cached && (!ttl || (now - cached.timestamp) < ttl)) {
      return cached.value;
    }

    // Compute new value with timing
    const startTime = performance.now();
    const value = factory();
    const duration = performance.now() - startTime;

    // Track computation time for optimization insights
    computationTimeRef.current.push(duration);
    if (computationTimeRef.current.length > 10) {
      computationTimeRef.current.shift();
    }

    // Cache the result
    cache.set(key, { value, timestamp: now });

    // Cleanup cache if needed
    if (cache.size > maxCacheSize) {
      const entries = Array.from(cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toDelete = entries.slice(0, cache.size - maxCacheSize);
      toDelete.forEach(([k]) => cache.delete(k));
    }

    // Provide optimization insights
    if (computationTimeRef.current.length >= 5) {
      const avgTime = computationTimeRef.current.reduce((a, b) => a + b, 0) / 
                     computationTimeRef.current.length;
      
      if (avgTime > 5) {
        console.debug(`🔍 ${name} average computation time: ${avgTime.toFixed(2)}ms`);
      }
    }

    return value;
  }, deps);
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

// === PERFORMANCE UTILITIES ===

/**
 * Utility to wrap components with automatic performance tracking
 */
export function trackComponentPerformance<P extends Record<string, any>>(
  Component: ComponentType<P>
): ComponentType<P> {
  const TrackedComponent = (props: P) => {
    const componentName = Component.displayName || Component.name || 'Unknown';
    const renderStartRef = useRef<number>(0);
    const lastPropsRef = useRef<P | null>(null);

    renderStartRef.current = performance.now();

    useEffect(() => {
      const renderTime = performance.now() - renderStartRef.current;
      const propsChanged = lastPropsRef.current && 
        JSON.stringify(props) !== JSON.stringify(lastPropsRef.current);
      
      ComponentAnalyzer.getInstance().trackComponent(
        componentName, 
        renderTime, 
        !!propsChanged
      );
      
      lastPropsRef.current = props;
    });

    return React.createElement(Component, props);
  };

  TrackedComponent.displayName = `Tracked(${Component.displayName || Component.name})`;
  return TrackedComponent;
}

// Export singleton analyzer instance
export const componentAnalyzer = ComponentAnalyzer.getInstance(); 