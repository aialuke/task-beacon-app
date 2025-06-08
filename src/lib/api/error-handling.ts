/**
 * Consolidated API Error Handling - Phase 1 Consolidation
 * 
 * Unified error formatting and handling for all API operations.
 * Consolidates duplicate logic from api-handlers.ts and error-handling.ts
 */

import { PostgrestError, AuthError } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/shared';

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
 * Standardized error object returned by error handlers
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
 * Enhanced error formatting that handles various error types
 * Consolidates formatApiError and extractErrorMessage functionality
 */
export const formatApiError = (error: unknown): ApiError => {
  // Handle Supabase PostgrestError with enhanced code mapping
  if (isPostgrestError(error)) {
    const pgError = error as PostgrestError;
    
    // Enhanced status code mapping
    let statusCode = 400;
    let userMessage = pgError.message;
    
    switch (pgError.code) {
      case 'PGRST116':
        statusCode = 404;
        userMessage = 'No data found';
        break;
      case 'PGRST204':
        statusCode = 404;
        userMessage = 'No results found';
        break;
      case '23505':
        statusCode = 409;
        userMessage = 'This item already exists';
        break;
      case '23503':
        statusCode = 409;
        userMessage = 'Cannot delete - item is being used elsewhere';
        break;
      case '42501':
        statusCode = 403;
        userMessage = 'You do not have permission to perform this action';
        break;
      default:
        userMessage = pgError.message || 'Database operation failed';
    }
    
    return {
      name: 'PostgrestError',
      message: userMessage,
      code: pgError.code,
      details: pgError.details,
      statusCode,
      originalError: error,
    };
  }

  // Handle Supabase AuthError
  if (error instanceof AuthError) {
    return {
      name: 'AuthError',
      message: error.message || 'Authentication failed',
      code: error.status?.toString(),
      statusCode: error.status || 401,
      originalError: error,
    };
  }

  // Handle JavaScript Error objects
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      name: 'StringError',
      message: error,
    };
  }

  // Handle unknown errors - properly convert to string for details
  const errorDetails = typeof error === 'object' && error !== null 
    ? (() => {
        try {
          return JSON.stringify(error);
        } catch {
          return String(error);
        }
      })()
    : String(error);

  return {
    name: 'UnknownError',
    message: 'An unexpected error occurred',
    details: errorDetails,
  };
};

/**
 * Consolidated error handling utility for API operations
 * Merges handleApiError functionality with enhanced options
 */
export function handleApiError(
  error: unknown,
  operation?: string,
  options: ErrorHandlingOptions = {}
): ProcessedError {
  const {
    showToast = false,
    logToConsole = true,
    rethrow = false,
    logPrefix = 'API Error',
  } = options;

  const apiError = formatApiError(error);
  const userMessage = apiError.message || (operation ?? 'An error occurred');

  // Use logger instead of console.error
  if (logToConsole) {
    // Convert unknown error to Error instance for logger
    const errorInstance = error instanceof Error ? error : new Error(apiError.message);
    logger.error(`${logPrefix}: ${operation ?? 'An error occurred'}`, errorInstance, {
      userMessage,
      errorCode: apiError.code,
      statusCode: apiError.statusCode,
    });
  }

  // Show user notification if requested
  if (showToast) {
    // Note: toast implementation would go here if needed
    // toast.error(userMessage);
  }

  // Re-throw if requested (useful for upstream error handling)
  if (rethrow) {
    const enhancedError = new Error(userMessage);
    (enhancedError as Error & { originalError?: unknown }).originalError = error;
    throw enhancedError;
  }

  return {
    originalError: error,
    message: userMessage,
    code: apiError.code,
    details: apiError.details || apiError.message,
    handled: true,
  };
}

/**
 * Centralized API request wrapper with consistent error handling and logging
 * Enhanced version of the original apiRequest function
 */
export const apiRequest = async <T>(
  operation: string,
  requestFn: () => Promise<T>
): Promise<{
  data: T | null;
  error: ApiError | null;
  success: boolean;
}> => {
  const startTime = Date.now();
  
  try {
    logger.debug(`API Request started: ${operation}`);
    
    const data = await requestFn();
    const duration = Date.now() - startTime;
    
    logger.debug(`API Request completed: ${operation} (${duration}ms)`);
    
    return {
      data,
      error: null,
      success: true,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const processedError = handleApiError(error, operation, {
      showToast: false,
      logToConsole: true,
      rethrow: false,
      logPrefix: 'API Request Failed',
    });
    
    // Convert ProcessedError to ApiError format
    const apiError: ApiError = {
      name: 'ApiRequestError',
      message: processedError.message,
      code: processedError.code,
      details: processedError.details,
      originalError: processedError.originalError,
    };
    
    return {
      data: null,
      error: apiError,
      success: false,
    };
  }
};

/**
 * Specialized error handlers for common scenarios
 */
export const apiErrorPatterns = {
  /**
   * Handle database constraint violations
   */
  handleConstraintError: (error: PostgrestError): ApiError => {
    return formatApiError(error);
  },

  /**
   * Handle authentication-specific API errors
   */
  handleAuthApiError: (error: AuthError): ApiError => {
    return formatApiError(error);
  },

  /**
   * Handle permission errors
   */
  handlePermissionError: (error: PostgrestError): ApiError => {
    return formatApiError(error);
  },
};

/**
 * Specialized error handler for authentication-related errors
 */
export function handleAuthError(error: unknown, operation: string): ProcessedError {
  return handleApiError(error, `Authentication: ${operation}`, {
    showToast: true,
    logToConsole: true,
    rethrow: false,
    logPrefix: 'Auth Error',
  });
}

/**
 * Specialized error handler for validation errors
 */
export function handleValidationError(error: unknown, fieldName: string): ProcessedError {
  return handleApiError(error, `Validation: ${fieldName}`, {
    showToast: false, // Validation errors usually shown inline
    logToConsole: true,
    rethrow: false,
    logPrefix: 'Validation Error',
  });
}

/**
 * Utility for consistent API error logging
 */
export const logApiError = (
  operation: string,
  error: unknown,
  context?: Record<string, unknown>
) => {
  const apiError = formatApiError(error);
  // Convert unknown error to Error instance for logger
  const errorInstance = error instanceof Error ? error : new Error(apiError.message);
  
  logger.error(`API Error in ${operation}`, errorInstance, {
    ...context,
    errorCode: apiError.code,
    statusCode: apiError.statusCode,
  });
};

// Export types for external use
export type { ErrorHandlingOptions, ProcessedError };
