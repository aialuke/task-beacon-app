
/**
 * Optimistic Async Operation Hook
 * 
 * Provides optimistic updates with rollback capability.
 */

import { useState, useCallback, useRef } from 'react';
import { useErrorHandler } from '@/hooks/core';

/**
 * Optimistic operation state interface
 */
export interface OptimisticAsyncOperationState<T = unknown> {
  data: T | null;
  optimisticData: T | null;
  loading: boolean;
  error: Error | null;
  isOptimistic: boolean;
}

/**
 * Optimistic operation options
 */
export interface OptimisticAsyncOperationOptions<T> {
  showErrorToast?: boolean;
  logErrors?: boolean;
  rollbackOnError?: boolean;
  optimisticUpdater?: (currentData: T | null, optimisticValue: T) => T;
}

/**
 * Hook for optimistic async operations with rollback
 */
export function useOptimisticAsyncOperation<T = unknown, TArgs extends any[] = any[]>(
  asyncFn: (...args: TArgs) => Promise<T>,
  options: OptimisticAsyncOperationOptions<T> = {}
) {
  const {
    showErrorToast = true,
    logErrors = true,
    rollbackOnError = true,
    optimisticUpdater,
  } = options;

  const [state, setState] = useState<OptimisticAsyncOperationState<T>>({
    data: null,
    optimisticData: null,
    loading: false,
    error: null,
    isOptimistic: false,
  });

  const { handleError } = useErrorHandler({
    showToast: showErrorToast,
    logToConsole: logErrors,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const rollbackDataRef = useRef<T | null>(null);

  const executeWithOptimistic = useCallback(async (
    optimisticValue: T,
    ...args: TArgs
  ): Promise<T | null> => {
    // Cancel any ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    // Store current data for potential rollback
    rollbackDataRef.current = state.data;

    // Apply optimistic update
    const optimisticData = optimisticUpdater
      ? optimisticUpdater(state.data, optimisticValue)
      : optimisticValue;

    setState(prev => ({
      ...prev,
      optimisticData,
      loading: true,
      error: null,
      isOptimistic: true,
    }));

    try {
      const result = await asyncFn(...args);

      if (!abortControllerRef.current.signal.aborted) {
        setState(prev => ({
          ...prev,
          data: result,
          optimisticData: null,
          loading: false,
          isOptimistic: false,
        }));
        return result;
      }
    } catch (error) {
      if (abortControllerRef.current.signal.aborted) {
        return null;
      }

      const processedError = error instanceof Error ? error : new Error(String(error));

      // Rollback optimistic update if enabled
      if (rollbackOnError) {
        setState(prev => ({
          ...prev,
          data: rollbackDataRef.current,
          optimisticData: null,
          loading: false,
          error: processedError,
          isOptimistic: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: processedError,
          isOptimistic: false,
        }));
      }

      handleError(processedError, 'Optimistic operation');
      return null;
    }

    return null;
  }, [asyncFn, state.data, optimisticUpdater, rollbackOnError, handleError]);

  const execute = useCallback(async (...args: TArgs): Promise<T | null> => {
    // Cancel any ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      isOptimistic: false,
    }));

    try {
      const result = await asyncFn(...args);

      if (!abortControllerRef.current.signal.aborted) {
        setState(prev => ({
          ...prev,
          data: result,
          optimisticData: null,
          loading: false,
        }));
        return result;
      }
    } catch (error) {
      if (abortControllerRef.current.signal.aborted) {
        return null;
      }

      const processedError = error instanceof Error ? error : new Error(String(error));

      setState(prev => ({
        ...prev,
        loading: false,
        error: processedError,
      }));

      handleError(processedError, 'Async operation');
      return null;
    }

    return null;
  }, [asyncFn, handleError]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(prev => ({ 
      ...prev, 
      loading: false, 
      isOptimistic: false,
      optimisticData: null,
    }));
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      data: null,
      optimisticData: null,
      loading: false,
      error: null,
      isOptimistic: false,
    });
    rollbackDataRef.current = null;
  }, []);

  return {
    ...state,
    currentData: state.isOptimistic ? state.optimisticData : state.data,
    execute,
    executeWithOptimistic,
    cancel,
    reset,
  };
}
