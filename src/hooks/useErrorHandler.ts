import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Unified error handling hook
 * 
 * Provides consistent error handling patterns across the application.
 * Replaces individual error handling implementations.
 */
export interface UseErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  onError?: (error: Error) => void;
}

export interface ErrorState {
  error: Error | null;
  hasError: boolean;
  isRecoverable: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { showToast = true, logToConsole = true, onError } = options;
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
    isRecoverable: true,
  });

  const handleError = useCallback((
    error: unknown,
    context?: string,
    isRecoverable = true
  ) => {
    const processedError = error instanceof Error 
      ? error 
      : new Error(String(error));

    // Log to console if enabled
    if (logToConsole) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, processedError);
    }

    // Show toast notification if enabled
    if (showToast) {
      toast.error(processedError.message || 'An error occurred');
    }

    // Update error state
    setErrorState({
      error: processedError,
      hasError: true,
      isRecoverable,
    });

    // Call custom error handler if provided
    onError?.(processedError);
  }, [showToast, logToConsole, onError]);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
      isRecoverable: true,
    });
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
          handleError(error, context);
          return null;
        }
      };
    },
    [handleError, clearError]
  );

  return {
    ...errorState,
    handleError,
    clearError,
    withErrorHandling,
  };
}
// CodeRabbit review
// CodeRabbit review
