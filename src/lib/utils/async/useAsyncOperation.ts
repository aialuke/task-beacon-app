
/**
 * Core Async Operation Hook
 * 
 * Provides basic async operation handling with loading states, 
 * error handling, and retry functionality.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/core';

/**
 * Async operation state interface
 */
export interface AsyncOperationState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: number | null;
}

/**
 * Async operation options
 */
export interface AsyncOperationOptions {
  /** Whether to show error toasts */
  showErrorToast?: boolean;
  /** Whether to log errors to console */
  logErrors?: boolean;
  /** Retry attempts on failure */
  retryAttempts?: number;
  /** Delay between retry attempts (ms) */
  retryDelay?: number;
  /** Timeout for the operation (ms) */
  timeout?: number;
  /** Whether to use optimistic updates */
  optimistic?: boolean;
}

/**
 * Async operation result
 */
export interface AsyncOperationResult<T> extends AsyncOperationState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
  cancel: () => void;
}

/**
 * Hook for managing async operations with comprehensive error handling
 */
export function useAsyncOperation<T = unknown, TArgs extends any[] = any[]>(
  asyncFn: (...args: TArgs) => Promise<T>,
  options: AsyncOperationOptions = {}
): AsyncOperationResult<T> {
  const {
    showErrorToast = true,
    logErrors = true,
    retryAttempts = 0,
    retryDelay = 1000,
    timeout = 30000,
    optimistic = false,
  } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const { handleError } = useErrorHandler({
    showToast: showErrorToast,
    logToConsole: logErrors,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastArgsRef = useRef<TArgs | null>(null);
  const retryCountRef = useRef(0);

  const executeWithRetry = useCallback(async (...args: TArgs): Promise<T | null> => {
    // Cancel any ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    lastArgsRef.current = args;

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }));

    try {
      // Set up timeout
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, timeout);

      const result = await asyncFn(...args);
      
      clearTimeout(timeoutId);

      if (!abortControllerRef.current.signal.aborted) {
        setState({
          data: result,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        });
        retryCountRef.current = 0;
        return result;
      }
    } catch (error) {
      if (abortControllerRef.current.signal.aborted) {
        return null; // Operation was cancelled
      }

      const processedError = error instanceof Error ? error : new Error(String(error));

      // Retry logic
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        return executeWithRetry(...args);
      }

      // Handle error after all retries failed
      handleError(processedError, `Async operation (attempts: ${retryCountRef.current + 1})`);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: processedError,
      }));
      
      retryCountRef.current = 0;
      return null;
    }

    return null;
  }, [asyncFn, handleError, retryAttempts, retryDelay, timeout]);

  const execute = useCallback(async (...args: TArgs): Promise<T | null> => {
    return executeWithRetry(...args);
  }, [executeWithRetry]);

  const retry = useCallback(async (): Promise<T | null> => {
    if (lastArgsRef.current) {
      return executeWithRetry(...lastArgsRef.current);
    }
    return null;
  }, [executeWithRetry]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
    retryCountRef.current = 0;
    lastArgsRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    cancel,
  };
}
