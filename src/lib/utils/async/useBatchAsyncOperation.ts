
/**
 * Batch Async Operations Hook
 * 
 * Handles multiple async operations with batch processing and tracking.
 */

import { useState, useCallback } from 'react';
import { useErrorHandler } from '@/hooks/core';
import type { AsyncOperationState, AsyncOperationOptions } from './useAsyncOperation';

/**
 * Hook for batch async operations
 */
export function useBatchAsyncOperation<T = unknown, TArgs extends any[] = any[]>(
  asyncFn: (...args: TArgs) => Promise<T>,
  options: AsyncOperationOptions = {}
) {
  const [operations, setOperations] = useState<Array<{
    id: string;
    args: TArgs;
    state: AsyncOperationState<T>;
  }>>([]);

  const { handleError } = useErrorHandler({
    showToast: options.showErrorToast,
    logToConsole: options.logErrors,
  });

  const executeBatch = useCallback(async (
    operationsData: { id: string; args: TArgs }[]
  ): Promise<{ id: string; result: T | null; error: Error | null }[]> => {
    // Initialize operations
    setOperations(operationsData.map(op => ({
      ...op,
      state: {
        data: null,
        loading: true,
        error: null,
        lastUpdated: null,
      },
    })));

    const results = await Promise.allSettled(
      operationsData.map(async ({ id, args }) => {
        try {
          const result = await asyncFn(...args);
          
          setOperations(prev => prev.map(op => 
            op.id === id 
              ? {
                  ...op,
                  state: {
                    data: result,
                    loading: false,
                    error: null,
                    lastUpdated: Date.now(),
                  },
                }
              : op
          ));

          return { id, result, error: null };
        } catch (error) {
          const processedError = error instanceof Error ? error : new Error(String(error));
          
          setOperations(prev => prev.map(op => 
            op.id === id 
              ? {
                  ...op,
                  state: {
                    data: null,
                    loading: false,
                    error: processedError,
                    lastUpdated: null,
                  },
                }
              : op
          ));

          handleError(processedError, `Batch operation ${id}`);
          return { id, result: null, error: processedError };
        }
      })
    );

    return results.map((result, index) => {
      const { id } = operationsData[index];
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return { id, result: null, error: result.reason };
      }
    });
  }, [asyncFn, handleError]);

  const getOperationState = useCallback((id: string) => {
    return operations.find(op => op.id === id)?.state ?? {
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    };
  }, [operations]);

  const resetBatch = useCallback(() => {
    setOperations([]);
  }, []);

  return {
    operations,
    executeBatch,
    getOperationState,
    resetBatch,
    totalOperations: operations.length,
    completedOperations: operations.filter(op => !op.state.loading).length,
    successfulOperations: operations.filter(op => op.state.data !== null).length,
    failedOperations: operations.filter(op => op.state.error !== null).length,
  };
}
