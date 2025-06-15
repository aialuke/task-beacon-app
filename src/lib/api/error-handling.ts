
/**
 * Consolidated API Error Handling - Phase 1 Consolidation
 *
 * Unified error formatting and handling for all API operations.
 * Consolidates duplicate logic from api-handlers.ts and error-handling.ts
 */

import { PostgrestError, AuthError } from '@supabase/supabase-js';

import { logger } from '@/lib/logger';

/**
 * Extended API error with additional properties
 */
interface ExtendedApiError {
  name: string;
  message: string;
  code?: string;
  details?: string;
  statusCode?: number;
  originalError?: unknown;
  timestamp?: string;
}

/**
 * Configuration options for error handling behavior
 */
interface ErrorHandlingOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  rethrow?: boolean;
  logPrefix?: string;
}

/**
 * Standardized error object returned by error handlers
 */
interface ProcessedError {
  originalError: unknown;
  message: string;
  code?: string;
  details?: string;
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
 * Safely converts unknown values to strings for logging/details
 */
function safeStringify(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object: cannot stringify]';
    }
  }

  try {
    return String(value);
  } catch {
    return '[Value: cannot convert to string]';
  }
}

/**
 * Enhanced error formatting that handles various error types
 */
export const formatApiError = (error: unknown): ExtendedApiError => {
  if (isPostgrestError(error)) {
    const pgError = error as PostgrestError;

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
      details: safeStringify(pgError.details),
      statusCode,
      originalError: error,
    };
  }

  if (error instanceof AuthError) {
    return {
      name: 'AuthError',
      message: error.message || 'Authentication failed',
      code: error.status?.toString(),
      statusCode: error.status || 401,
      originalError: error,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      originalError: error,
    };
  }

  if (typeof error === 'string') {
    return {
      name: 'StringError',
      message: error,
    };
  }

  return {
    name: 'UnknownError',
    message: 'An unexpected error occurred',
    details: safeStringify(error),
    originalError: error,
  };
};

/**
 * Consolidated error handling utility for API operations
 */
function handleApiError(
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

  if (logToConsole) {
    const errorInstance =
      error instanceof Error ? error : new Error(apiError.message);

    const logContext: Record<string, unknown> = {
      userMessage,
      errorCode: apiError.code || 'UNKNOWN',
      statusCode: apiError.statusCode || 500,
      errorDetails: safeStringify(apiError.details || 'No additional details'),
    };

    logger.error(
      `${logPrefix}: ${operation ?? 'An error occurred'}`,
      errorInstance,
      logContext
    );
  }

  if (rethrow) {
    const enhancedError = new Error(userMessage);
    (enhancedError as Error & { originalError?: unknown }).originalError =
      error;
    throw enhancedError;
  }

  return {
    originalError: error,
    message: userMessage,
    code: apiError.code,
    details: safeStringify(apiError.details || apiError.message),
    handled: true,
  };
}

/**
 * Centralized API request wrapper with consistent error handling and logging
 */
export const apiRequest = async <T>(
  operation: string,
  requestFn: () => Promise<T>
): Promise<{
  data: T | null;
  error: ExtendedApiError | null;
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

    const apiError: ExtendedApiError = {
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
