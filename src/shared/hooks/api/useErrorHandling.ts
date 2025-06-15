
import { toast } from 'sonner';

import { useUnifiedError } from '@/hooks/core/useUnifiedError';
import { logger } from '@/lib/logger';
import { formatApiError } from '@/shared/services/api';
import type { ApiError } from '@/types';

/**
 * Standardized Error Handling for Data Access Hooks
 *
 * Provides consistent error handling patterns across all data access hooks,
 * ensuring unified user feedback and logging behavior.
 *
 * **Updated**: Now uses useUnifiedError internally for state management consolidation.
 */

export interface DataAccessErrorOptions {
  /** Operation context for error messages (e.g., 'create task', 'upload photo') */
  operation: string;
  /** Whether to show toast notification (default: true) */
  showToast?: boolean;
  /** Whether to log error (default: true) */
  logError?: boolean;
  /** Custom error message prefix */
  messagePrefix?: string;
}

export interface DataAccessErrorResult {
  success: false;
  error: string;
  apiError: ApiError;
}

/**
 * Hook for standardized data access error handling with unified error state management
 */
export function useDataAccessErrorHandling(operation: string) {
  const { handleError: handleUnifiedError, clearError } = useUnifiedError({
    showToast: false, // We'll handle toast notifications manually for data access operations
  });

  const handleError = (
    error: unknown,
    options: Omit<DataAccessErrorOptions, 'operation'> = {}
  ): DataAccessErrorResult => {
    const { showToast = true, logError = true, messagePrefix } = options;

    // Format error using existing API error formatter
    const apiError = formatApiError(error);

    // Create user-friendly error message
    const prefix = messagePrefix || `Failed to ${operation}`;
    const errorMessage = `${prefix}: ${apiError.message}`;

    // Update unified error state with the formatted error
    const errorInstance =
      error instanceof Error ? error : new Error(apiError.message);
    handleUnifiedError(errorInstance, `Data Access [${operation}]`);

    // Log error for debugging (unified error already logs, but we add operation context)
    if (logError) {
      logger.error(`Data Access Error [${operation}]:`, errorInstance);
    }

    // Show user notification
    if (showToast) {
      toast.error(errorMessage);
    }

    return {
      success: false,
      error: errorMessage,
      apiError,
    };
  };

  const handleSuccess = (showToast = true): void => {
    // Clear any previous errors
    clearError();

    if (showToast) {
      // Capitalize first letter of operation for user-friendly message
      const message = `${operation.charAt(0).toUpperCase()}${operation.slice(1)} successful`;
      toast.success(message);
    }
  };

  return {
    handleError,
    handleSuccess,
    clearError,
  };
}

/**
 * Standardized error handler for data access hooks
 * Provides consistent error formatting, logging, and user feedback
 *
 * **Deprecated**: Use useDataAccessErrorHandling hook instead for unified state management
 */
export function handleDataAccessError(
  error: unknown,
  options: DataAccessErrorOptions
): DataAccessErrorResult {
  const {
    operation,
    showToast = true,
    logError = true,
    messagePrefix,
  } = options;

  // Format error using existing API error formatter
  const apiError = formatApiError(error);

  // Create user-friendly error message
  const prefix = messagePrefix || `Failed to ${operation}`;
  const errorMessage = `${prefix}: ${apiError.message}`;

  // Log error for debugging
  if (logError) {
    const errorInstance =
      error instanceof Error ? error : new Error(apiError.message);
    logger.error(`Data Access Error [${operation}]:`, errorInstance);
  }

  // Show user notification
  if (showToast) {
    toast.error(errorMessage);
  }

  return {
    success: false,
    error: errorMessage,
    apiError,
  };
}

/**
 * Standardized success handler for data access hooks
 * Provides consistent success feedback
 */
export function handleDataAccessSuccess(
  operation: string,
  showToast = true
): void {
  if (showToast) {
    // Capitalize first letter of operation for user-friendly message
    const message = `${operation.charAt(0).toUpperCase()}${operation.slice(1)} successful`;
    toast.success(message);
  }
}

/**
 * Error boundary for async data operations
 * Wraps async functions with standardized error handling
 */
export function withDataAccessErrorHandling<TArgs extends unknown[], TResult>(
  asyncFn: (...args: TArgs) => Promise<TResult>,
  operation: string,
  options: Omit<DataAccessErrorOptions, 'operation'> = {}
): (...args: TArgs) => Promise<TResult | DataAccessErrorResult> {
  return async (...args: TArgs): Promise<TResult | DataAccessErrorResult> => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      return handleDataAccessError(error, { operation, ...options });
    }
  };
}

/**
 * Type guard to check if result is an error
 */
export function isDataAccessError(
  result: unknown
): result is DataAccessErrorResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    (result as any).success === false &&
    'error' in result
  );
}

/**
 * Common error patterns for data access operations
 */
export const ErrorPatterns = {
  // Query operations
  FETCH_FAILED: 'fetch data',
  LOAD_FAILED: 'load data',

  // Mutation operations
  CREATE_FAILED: 'create item',
  UPDATE_FAILED: 'update item',
  DELETE_FAILED: 'delete item',

  // Auth operations
  SIGNIN_FAILED: 'sign in',
  SIGNUP_FAILED: 'sign up',
  SIGNOUT_FAILED: 'sign out',

  // Media operations
  UPLOAD_FAILED: 'upload file',
  DOWNLOAD_FAILED: 'download file',
} as const;

/**
 * Pre-configured error handlers for common operations
 */
export const createErrorHandler = (operation: string) => ({
  handle: (
    error: unknown,
    options?: Omit<DataAccessErrorOptions, 'operation'>
  ) => handleDataAccessError(error, { operation, ...options }),

  wrap: <TArgs extends unknown[], TResult>(
    asyncFn: (...args: TArgs) => Promise<TResult>,
    options?: Omit<DataAccessErrorOptions, 'operation'>
  ) => withDataAccessErrorHandling(asyncFn, operation, options),
});
