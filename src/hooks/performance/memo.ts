
/**
 * Performance Optimization Utilities - Phase 2.4 Revised
 * 
 * Simplified approach - use these ONLY for proven performance bottlenecks.
 * For simple operations, prefer standard useMemo/useCallback.
 */

import { useMemo, useCallback, DependencyList } from 'react';

interface MemoOptions {
  name?: string;
}

/**
 * Use this ONLY for computationally expensive operations or when profiling shows actual benefit
 * For simple operations, prefer standard useMemo
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: DependencyList,
  options: MemoOptions = {}
): T {
  // Simplified - just use standard useMemo
  return useMemo(factory, deps);
}

/**
 * Use this ONLY for callbacks passed to many child components or expensive operations
 * For simple event handlers, prefer standard useCallback
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
  options: MemoOptions = {}
): T {
  // Simplified - just use standard useCallback
  return useCallback(callback, deps);
}
