
/**
 * Async Operation Factory
 * 
 * Creates standardized async operation hooks with consistent patterns.
 */

import { useAsyncOperation, type AsyncOperationOptions } from './useAsyncOperation';
import { useBatchAsyncOperation, type BatchAsyncOperationOptions } from './useBatchAsyncOperation';
import { useOptimisticAsyncOperation, type OptimisticAsyncOperationOptions } from './useOptimisticAsyncOperation';

/**
 * Factory for creating standardized async operation hooks
 */
export function createAsyncOperationFactory<T, TArgs extends any[]>(
  asyncFn: (...args: TArgs) => Promise<T>,
  defaultOptions: AsyncOperationOptions = {}
) {
  return {
    /**
     * Create a basic async operation hook
     */
    useBasic: (overrideOptions?: AsyncOperationOptions) => {
      return useAsyncOperation(asyncFn, { ...defaultOptions, ...overrideOptions });
    },

    /**
     * Create a batch async operation hook
     */
    useBatch: (batchOptions?: BatchAsyncOperationOptions) => {
      return useBatchAsyncOperation(asyncFn, batchOptions);
    },

    /**
     * Create an optimistic async operation hook
     */
    useOptimistic: (optimisticOptions?: OptimisticAsyncOperationOptions<T>) => {
      return useOptimisticAsyncOperation(asyncFn, optimisticOptions);
    },
  };
}

/**
 * Pre-configured factories for common operations
 */
export const asyncOperationFactories = {
  /**
   * Factory for API operations with standard error handling
   */
  createApiOperation: <T, TArgs extends any[]>(
    asyncFn: (...args: TArgs) => Promise<T>
  ) => createAsyncOperationFactory(asyncFn, {
    showErrorToast: true,
    logErrors: true,
    retryAttempts: 2,
    retryDelay: 1000,
    timeout: 30000,
  }),

  /**
   * Factory for UI operations with minimal error handling
   */
  createUIOperation: <T, TArgs extends any[]>(
    asyncFn: (...args: TArgs) => Promise<T>
  ) => createAsyncOperationFactory(asyncFn, {
    showErrorToast: false,
    logErrors: false,
    retryAttempts: 1,
    timeout: 10000,
  }),

  /**
   * Factory for critical operations with aggressive retry
   */
  createCriticalOperation: <T, TArgs extends any[]>(
    asyncFn: (...args: TArgs) => Promise<T>
  ) => createAsyncOperationFactory(asyncFn, {
    showErrorToast: true,
    logErrors: true,
    retryAttempts: 5,
    retryDelay: 2000,
    timeout: 60000,
  }),
};
