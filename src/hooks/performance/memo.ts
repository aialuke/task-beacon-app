
/**
 * Optimized Memo Hook
 * Performance optimization utilities for memoization
 */

import { useMemo, useCallback, DependencyList } from 'react';

interface MemoOptions {
  name?: string;
}

export function useOptimizedMemo<T>(
  factory: () => T,
  deps: DependencyList,
  options: MemoOptions = {}
): T {
  return useMemo(factory, deps);
}

export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
  options: MemoOptions = {}
): T {
  return useCallback(callback, deps);
}
