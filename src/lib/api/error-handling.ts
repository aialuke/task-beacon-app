
/**
 * API Error Handling Utilities
 * 
 * Centralized error formatting and handling for all API operations.
 * This module provides domain-specific error handling for API layer.
 * 
 * Phase 3: Verified - No duplication with consolidated error system.
 * This module provides API-specific functionality that complements
 * the general error handling system.
 */

import { PostgrestError, AuthError } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/shared';

/**
 * Enhanced error formatting that handles various error types
 * Specialized for API responses and Supabase-specific errors
 */
export const formatApiError = (error: unknown): ApiError => {
  // Handle Supabase PostgrestError
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    return {
      name: 'PostgrestError',
      message: pgError.message,
      code: pgError.code,
      details: pgError.details,
      statusCode: pgError.code === 'PGRST116' ? 404 : 400,
      originalError: error,
    };
  }

  // Handle Supabase AuthError
  if (error instanceof AuthError) {
    return {
      name: 'AuthError',
      message: error.message,
      code: error.status?.toString(),
      statusCode: error.status || 400,
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

  // Handle unknown errors
  return {
    name: 'UnknownError',
    message: 'An unexpected error occurred',
    details: error,
  };
};

/**
 * Centralized API request wrapper with consistent error handling and logging
 * Specialized for API operations with timing and context tracking
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
    const apiError = formatApiError(error);
    
    logger.error(`API Request failed: ${operation} (${duration}ms)`, error as Error, {
      operation,
      duration,
      errorCode: apiError.code,
    });
    
    return {
      data: null,
      error: apiError,
      success: false,
    };
  }
};

/**
 * API-specific error handling patterns for common scenarios
 */
export const apiErrorPatterns = {
  /**
   * Handle database constraint violations
   */
  handleConstraintError: (error: PostgrestError): ApiError => {
    switch (error.code) {
      case '23505':
        return {
          name: 'UniqueConstraintError',
          message: 'This item already exists',
          code: error.code,
          statusCode: 409,
          originalError: error,
        };
      case '23503':
        return {
          name: 'ForeignKeyConstraintError',
          message: 'Cannot delete - item is being used elsewhere',
          code: error.code,
          statusCode: 409,
          originalError: error,
        };
      default:
        return formatApiError(error);
    }
  },

  /**
   * Handle authentication-specific API errors
   */
  handleAuthApiError: (error: AuthError): ApiError => {
    return {
      name: 'AuthApiError',
      message: error.message || 'Authentication failed',
      code: error.status?.toString(),
      statusCode: error.status || 401,
      originalError: error,
    };
  },

  /**
   * Handle permission errors
   */
  handlePermissionError: (error: PostgrestError): ApiError => {
    return {
      name: 'PermissionError',
      message: 'You do not have permission to perform this action',
      code: error.code,
      statusCode: 403,
      originalError: error,
    };
  },
};

/**
 * Utility for consistent API error logging
 */
export const logApiError = (
  operation: string,
  error: unknown,
  context?: Record<string, unknown>
) => {
  const apiError = formatApiError(error);
  logger.error(`API Error in ${operation}`, error as Error, {
    ...context,
    errorCode: apiError.code,
    statusCode: apiError.statusCode,
  });
};
// CodeRabbit review
// CodeRabbit review
