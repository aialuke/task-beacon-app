/**
 * Simplified Lazy Loading System - Phase 3 Optimization
 * 
 * Uses React.lazy directly instead of over-engineered factory patterns.
 * Maintains backward compatibility through simple re-exports.
 */

import { lazy, Suspense } from 'react';

import { LoadingSpinner, PageLoader, CardLoader } from './loading/UnifiedLoadingStates';

// === SIMPLIFIED LAZY UTILITIES ===

/**
 * Simple wrapper for lazy loading with appropriate fallback
 */
export function createLazyComponent<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback: React.ReactNode = <LoadingSpinner size="md" />
) {
  const LazyComponent = lazy(importFn);
  
  return function WrappedLazyComponent(props: T) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// === BACKWARD COMPATIBILITY EXPORTS ===
// LazyComponents API removed - no longer used anywhere in codebase

// === COMMON LAZY COMPONENT PATTERNS ===

/**
 * Pre-configured lazy loaders for common use cases
 */
export function lazy_form<T>(importFn: () => Promise<{ default: React.ComponentType<T> }>) {
  return createLazyComponent(importFn, <CardLoader count={1} />);
}

export function lazy_page<T>(importFn: () => Promise<{ default: React.ComponentType<T> }>) {
  return createLazyComponent(importFn, <PageLoader message="Loading page..." />);
}

export function lazy_component<T>(importFn: () => Promise<{ default: React.ComponentType<T> }>) {
  return createLazyComponent(importFn, <LoadingSpinner size="md" />);
}
