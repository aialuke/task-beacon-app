
/**
 * Unified Error Hook - Phase 1 Consolidation
 */

import { useState, useCallback } from 'react';

import {
  handleError,
  createErrorState,
  type ErrorOptions,
  type ErrorState,
} from '@/lib/core/ErrorHandler';

/**
 * Extended API error with additional properties
 */
interface ExtendedApiError {
  message: string;
  name: string;
  code?: string;
  originalError?: unknown;
}

interface UseUnifiedErrorOptions extends ErrorOptions {
  initialError?: Error | null;
}

interface UseUnifiedErrorReturn {
  error: Error | null;
  hasError: boolean;
  isRecoverable: boolean;
  handleError: (error: unknown, context?: string) => void;
  clearError: () => void;
  withErrorHandling: <T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => (...args: T) => Promise<R | null>;
  safeAsync: <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ) => Promise<T | null>;
}

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
      }) as ExtendedApiError;

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
    error: errorState.error,
    hasError: errorState.hasError,
    isRecoverable: errorState.isRecoverable,
    handleError: handleErrorCallback,
    clearError,
    withErrorHandling,
    safeAsync,
  };
}
