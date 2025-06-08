
/**
 * Core Async Operation Hook - Simplified Implementation
 * 
 * Removed unnecessary complexity: retry logic, timeouts, abort controllers for simple operations.
 * Focus on essential async operation patterns.
 */

import { useState, useCallback } from 'react';
import { useErrorHandler } from '@/hooks/core';
import type { BaseAsyncState } from '@/types/async-state.types';

/**
 * Simplified async operation options
 */
export interface AsyncOperationOptions {
  /** Whether to show error toasts */
  showErrorToast?: boolean;
  /** Whether to log errors to console */
  logErrors?: boolean;
}

/**
 * Simplified async operation result
 */
export interface AsyncOperationResult<T> extends BaseAsyncState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Simplified hook for managing async operations
 */
export function useAsyncOperation<T = unknown, TArgs extends any[] = any[]>(
  asyncFn: (...args: TArgs) => Promise<T>,
  options: AsyncOperationOptions = {}
): AsyncOperationResult<T> {
  const {
    showErrorToast = true,
    logErrors = true,
  } = options;

  const [state, setState] = useState<BaseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const { handleError } = useErrorHandler({
    showToast: showErrorToast,
    logToConsole: logErrors,
  });

  const execute = useCallback(async (...args: TArgs): Promise<T | null> => {
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }));

    try {
      const result = await asyncFn(...args);
      
      setState({
        data: result,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      });
      
      return result;
    } catch (error) {
      const processedError = error instanceof Error ? error : new Error(String(error));
      
      handleError(processedError, 'Async operation');
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: processedError,
      }));
      
      return null;
    }
  }, [asyncFn, handleError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
