
/**
 * Performance Optimization Utilities
 * Simplified approach focusing on actual performance benefits
 */

import { useMemo, useCallback, DependencyList } from 'react';

interface MemoOptions {
  name?: string;
}

/**
 * Use this only for computationally expensive operations or when profiling shows actual benefit
 * For simple operations, prefer standard useMemo
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: DependencyList,
  options: MemoOptions = {}
): T {
  return useMemo(factory, deps);
}

/**
 * Use this only for callbacks passed to many child components or expensive operations
 * For simple event handlers, prefer standard useCallback
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
  options: MemoOptions = {}
): T {
  return useCallback(callback, deps);
}
