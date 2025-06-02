
/**
 * Enhanced Error Handling Utilities
 * 
 * Provides comprehensive error handling with logging, user feedback,
 * and type-safe error classification.
 */

import { toast } from '@/lib/toast';
import { logger } from '@/lib/logger';

// Clean imports from organized type system
import type { ApiError } from '@/types/shared';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Configuration options for error handling behavior
 */
interface ErrorHandlingOptions {
  /** Whether to show a toast notification to the user */
  showToast?: boolean;
  /** Whether to log the error to the console for debugging */
  logToConsole?: boolean;
  /** Whether to re-throw the error after processing */
  rethrow?: boolean;
  /** Custom prefix for console logging (defaults to '[API Error]') */
  logPrefix?: string;
}

/**
 * Standardized error object returned by handleApiError
 */
interface ProcessedError {
  /** The original error object */
  originalError: unknown;
  /** User-friendly error message */
  message: string;
  /** Error code if available (from Supabase errors) */
  code?: string;
  /** Detailed error information for debugging */
  details?: string;
  /** Whether this error was handled by our error system */
  handled: true;
}

/**
 * Global error handler for unhandled errors and promise rejections
 * This integrates with our ErrorBoundary for consistent error handling
 */
export function setupGlobalErrorHandlers() {
  // Handle unhandled errors
  window.addEventListener('error', (event) => {
    const error = event.error || new Error(event.message);
    handleGlobalError(error, 'Unhandled Error');
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    handleGlobalError(error, 'Unhandled Promise Rejection');
  });
}

/**
 * Handle global errors that aren't caught by ErrorBoundary
 */
function handleGlobalError(error: Error, source: string) {
  logger.error(`Global error - ${source}`, error, {
    userAgent: navigator.userAgent,
    url: window.location.href,
  });

  // Show user-friendly notification for global errors
  toast.error('Something went wrong. Please refresh the page if the problem persists.');
}

/**
 * Type guard to check if an error is a Supabase PostgrestError
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
}

/**
 * Extract a user-friendly message from various error types
 */
function extractErrorMessage(error: unknown): string {
  if (isPostgrestError(error)) {
    // Handle specific Supabase error codes
    switch (error.code) {
      case 'PGRST116':
        return 'No data found';
      case 'PGRST204':
        return 'No results found';
      case '23505':
        return 'This item already exists';
      case '23503':
        return 'Cannot delete - item is being used elsewhere';
      case '42501':
        return 'You do not have permission to perform this action';
      default:
        return error.message || 'Database operation failed';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Centralized error handling utility for API operations
 */
export function handleApiError(
  error: unknown,
  operation?: string,
  options: ErrorHandlingOptions = {}
): void {
  const {
    showToast = false,
    logToConsole = true,
    rethrow = false,
    logPrefix = 'API Error',
  } = options;

  // Extract user-friendly message
  const userMessage = extractErrorMessage(error) || operation || 'An error occurred';

  // Use logger instead of console.error
  if (logToConsole) {
    logger.error(`${logPrefix}: ${operation || 'An error occurred'}`, error as Error, {
      userMessage,
    });
  }

  // Show user notification if requested
  if (showToast) {
    toast.error(userMessage);
  }

  // Re-throw if requested (useful for upstream error handling)
  if (rethrow) {
    const enhancedError = new Error(userMessage);
    // Attach original error for debugging (TypeScript-compatible approach)
    (enhancedError as Error & { originalError?: unknown }).originalError = error;
    throw enhancedError;
  }
}

/**
 * Specialized error handler for authentication-related errors
 */
export function handleAuthError(error: unknown, operation: string): ProcessedError {
  const authSpecificMessage = `Failed to ${operation}. Please check your credentials and try again.`;
  
  // Handle the error and create a ProcessedError response
  handleApiError(error, authSpecificMessage, {
    showToast: true,
    logToConsole: true,
    rethrow: false,
    logPrefix: 'Auth Error',
  });

  return {
    originalError: error,
    message: authSpecificMessage,
    code: isPostgrestError(error) ? error.code : undefined,
    details: extractErrorMessage(error),
    handled: true,
  };
}

/**
 * Specialized error handler for validation errors
 */
export function handleValidationError(error: unknown, fieldName: string): ProcessedError {
  const validationMessage = `Invalid ${fieldName}. Please check your input and try again.`;
  
  // Handle the error and create a ProcessedError response
  handleApiError(error, validationMessage, {
    showToast: false, // Validation errors usually shown inline
    logToConsole: true,
    rethrow: false,
    logPrefix: 'Validation Error',
  });

  return {
    originalError: error,
    message: validationMessage,
    code: isPostgrestError(error) ? error.code : undefined,
    details: extractErrorMessage(error),
    handled: true,
  };
}

/**
 * Utility to safely execute async functions with standardized error handling
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string,
  options?: ErrorHandlingOptions
): Promise<T | null> {
  try {
    return await asyncFn();
  } catch (error) {
    handleApiError(error, errorMessage, options);
    return null;
  }
}

/**
 * Higher-order function that wraps an async function with error handling
 */
export function withErrorHandling<TArgs extends unknown[], TRes>(
  fn: (...args: TArgs) => Promise<TRes>,
  errorMessage?: string,
  options?: ErrorHandlingOptions
): (...args: TArgs) => Promise<TRes | null> {
  return async (...args: TArgs): Promise<TRes | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, errorMessage, options);
      return null;
    }
  };
}

// Legacy export for backward compatibility
export const errorUtils = {
  setupGlobalErrorHandlers,
  handleApiError,
  handleAuthError,
  handleValidationError,
  safeAsync,
  withErrorHandling,
};

// Re-export types
export type { ErrorHandlingOptions, ProcessedError };
