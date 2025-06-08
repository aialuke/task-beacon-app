
/**
 * Batch Async Operation Hook
 * 
 * Handles multiple async operations with unified state management.
 */

import { useState, useCallback, useRef } from 'react';
import { useErrorHandler } from '@/hooks/core';

/**
 * Batch operation state interface
 */
export interface BatchAsyncOperationState<T = unknown> {
  data: T[];
  loading: boolean;
  error: Error | null;
  progress: number;
  completed: number;
  total: number;
}

/**
 * Batch operation options
 */
export interface BatchAsyncOperationOptions {
  concurrency?: number;
  showErrorToast?: boolean;
  logErrors?: boolean;
  stopOnFirstError?: boolean;
}

/**
 * Hook for managing batch async operations
 */
export function useBatchAsyncOperation<T = unknown, TArgs extends any[] = any[]>(
  asyncFn: (...args: TArgs) => Promise<T>,
  options: BatchAsyncOperationOptions = {}
) {
  const {
    concurrency = 3,
    showErrorToast = true,
    logErrors = true,
    stopOnFirstError = false,
  } = options;

  const [state, setState] = useState<BatchAsyncOperationState<T>>({
    data: [],
    loading: false,
    error: null,
    progress: 0,
    completed: 0,
    total: 0,
  });

  const { handleError } = useErrorHandler({
    showToast: showErrorToast,
    logToConsole: logErrors,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const executeBatch = useCallback(async (argsList: TArgs[]): Promise<T[]> => {
    // Cancel any ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const total = argsList.length;

    setState({
      data: [],
      loading: true,
      error: null,
      progress: 0,
      completed: 0,
      total,
    });

    const results: T[] = [];
    const errors: Error[] = [];
    let completed = 0;

    // Process in batches with controlled concurrency
    for (let i = 0; i < argsList.length; i += concurrency) {
      if (abortControllerRef.current.signal.aborted) {
        break;
      }

      const batch = argsList.slice(i, i + concurrency);
      const batchPromises = batch.map(async (args, index) => {
        try {
          const result = await asyncFn(...args);
          completed++;
          
          setState(prev => ({
            ...prev,
            completed,
            progress: (completed / total) * 100,
          }));
          
          return { success: true, result, index: i + index };
        } catch (error) {
          const processedError = error instanceof Error ? error : new Error(String(error));
          errors.push(processedError);
          completed++;
          
          setState(prev => ({
            ...prev,
            completed,
            progress: (completed / total) * 100,
          }));
          
          if (stopOnFirstError) {
            handleError(processedError, 'Batch operation');
            throw processedError;
          }
          
          return { success: false, error: processedError, index: i + index };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      
      // Collect successful results
      batchResults.forEach(result => {
        if (result.success) {
          results[result.index] = result.result;
        }
      });

      if (stopOnFirstError && errors.length > 0) {
        break;
      }
    }

    const finalError = errors.length > 0 ? errors[0] : null;
    
    setState(prev => ({
      ...prev,
      data: results.filter(r => r !== undefined),
      loading: false,
      error: finalError,
    }));

    if (finalError && !stopOnFirstError) {
      handleError(finalError, `Batch operation (${errors.length}/${total} failed)`);
    }

    return results.filter(r => r !== undefined);
  }, [asyncFn, concurrency, stopOnFirstError, handleError]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      data: [],
      loading: false,
      error: null,
      progress: 0,
      completed: 0,
      total: 0,
    });
  }, []);

  return {
    ...state,
    executeBatch,
    cancel,
    reset,
  };
}
