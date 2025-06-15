
/**
 * Unified Error Hook - Phase 1 Consolidation
 *
 * Replaces useErrorHandler and useAsyncOperation with a single,
 * consistent error handling hook for React components.
 */

import { useState, useCallback } from 'react';

import {
  handleError,
  createErrorState,
  type ErrorOptions,
  type ErrorState,
} from '@/lib/core/ErrorHandler';

// === HOOK INTERFACE ===

interface UseUnifiedErrorOptions extends ErrorOptions {
  /** Initial error state */
  initialError?: Error | null;
}

interface UseUnifiedErrorReturn {
  // State
  error: Error | null;
  hasError: boolean;
  isRecoverable: boolean;

  // Actions
  handleError: (error: unknown, context?: string) => void;
  clearError: () => void;

  // Utilities
  withErrorHandling: <T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => (...args: T) => Promise<R | null>;

  safeAsync: <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ) => Promise<T | null>;
}

// === UNIFIED ERROR HOOK ===

/**
 * Single hook for all error handling needs in React components
 */
export function useUnifiedError(
  options: UseUnifiedErrorOptions = {}
): UseUnifiedErrorReturn {
  const {
    showToast = true,
    logToConsole = true,
    context: defaultContext,
    initialError = null,
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>(() =>
    createErrorState(initialError)
  );

  const handleErrorCallback = useCallback(
    (error: unknown, context?: string) => {
      const processedError = handleError(error, {
        showToast,
        logToConsole,
        context: context || defaultContext,
      });

      // Convert ApiError back to Error for state consistency
      const errorInstance =
        processedError.originalError instanceof Error
          ? processedError.originalError
          : new Error(processedError.message);

      setErrorState(createErrorState(errorInstance));
    },
    [showToast, logToConsole, defaultContext]
  );

  const clearError = useCallback(() => {
    setErrorState(createErrorState());
  }, []);

  const withErrorHandling = useCallback(
    <T extends unknown[], R>(
      fn: (...args: T) => Promise<R>,
      context?: string
    ) => {
      return async (...args: T): Promise<R | null> => {
        try {
          clearError();
          return await fn(...args);
        } catch (error) {
          handleErrorCallback(error, context);
          return null;
        }
      };
    },
    [handleErrorCallback, clearError]
  );

  const safeAsync = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: string
    ): Promise<T | null> => {
      try {
        clearError();
        return await asyncFn();
      } catch (error) {
        handleErrorCallback(error, context);
        return null;
      }
    },
    [handleErrorCallback, clearError]
  );

  return {
    // State
    error: errorState.error,
    hasError: errorState.hasError,
    isRecoverable: errorState.isRecoverable,

    // Actions
    handleError: handleErrorCallback,
    clearError,

    // Utilities
    withErrorHandling,
    safeAsync,
  };
}
