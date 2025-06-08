
/**
 * Standardized Memoization Utilities - Phase 2.1 Implementation
 * 
 * Provides consistent memoization patterns for components and hooks
 */

import { memo, useMemo, useCallback, DependencyList } from 'react';

/**
 * Standard component memoization with display name preservation
 */
export function memoizeComponent<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
): React.NamedExoticComponent<P> {
  const MemoizedComponent = memo(Component, propsAreEqual);
  MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

/**
 * Memoization for expensive computations
 */
export function useMemoizedComputation<T>(
  factory: () => T,
  deps: DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Memoization for stable callbacks
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  return useCallback(callback, deps);
}

/**
 * Complex object comparison for memo
 */
export function createShallowEqual<T extends Record<string, any>>() {
  return (prevProps: T, nextProps: T): boolean => {
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) {
      return false;
    }
    
    for (const key of prevKeys) {
      if (prevProps[key] !== nextProps[key]) {
        return false;
      }
    }
    
    return true;
  };
}

/**
 * Deep equality check for complex props
 */
export function createDeepEqual<T>() {
  return (prevProps: T, nextProps: T): boolean => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  };
}
