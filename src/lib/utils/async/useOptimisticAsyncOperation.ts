
/**
 * Optimistic Async Operations Hook
 * 
 * Provides optimistic updates for async operations with rollback support.
 */

import { useState, useCallback } from 'react';
import { useAsyncOperation, type AsyncOperationOptions } from './useAsyncOperation';

/**
 * Hook for optimistic updates
 */
export function useOptimisticAsyncOperation<T = unknown, TArgs extends any[] = any[]>(
  asyncFn: (...args: TArgs) => Promise<T>,
  optimisticUpdateFn?: (currentData: T | null, ...args: TArgs) => T,
  options: AsyncOperationOptions = {}
) {
  const baseOperation = useAsyncOperation(asyncFn, { ...options, optimistic: true });
  const [optimisticData, setOptimisticData] = useState<T | null>(null);

  const executeOptimistic = useCallback(async (...args: TArgs): Promise<T | null> => {
    // Apply optimistic update
    if (optimisticUpdateFn) {
      const optimisticResult = optimisticUpdateFn(baseOperation.data, ...args);
      setOptimisticData(optimisticResult);
    }

    try {
      const result = await baseOperation.execute(...args);
      setOptimisticData(null); // Clear optimistic data on success
      return result;
    } catch (error) {
      setOptimisticData(null); // Clear optimistic data on error
      throw error;
    }
  }, [baseOperation, optimisticUpdateFn]);

  return {
    ...baseOperation,
    data: optimisticData ?? baseOperation.data,
    execute: executeOptimistic,
    isOptimistic: optimisticData !== null,
  };
}
