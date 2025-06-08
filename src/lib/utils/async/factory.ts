
/**
 * Async Operation Factory
 * 
 * Utility for creating configured async operation hooks.
 */

import { useAsyncOperation, type AsyncOperationOptions } from './useAsyncOperation';

/**
 * Utility for creating async operation factories
 */
export function createAsyncOperationFactory<T = unknown, TArgs extends any[] = any[]>(
  defaultOptions: AsyncOperationOptions = {}
) {
  return function createAsyncOperation(
    asyncFn: (...args: TArgs) => Promise<T>,
    options: AsyncOperationOptions = {}
  ) {
    const mergedOptions = { ...defaultOptions, ...options };
    return () => useAsyncOperation(asyncFn, mergedOptions);
  };
}
