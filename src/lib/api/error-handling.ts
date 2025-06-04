/**
 * API Error Handling Utilities
 * 
 * Centralized error formatting and handling for all API operations.
 */

import { PostgrestError, AuthError } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/shared';

/**
 * Enhanced error formatting that handles various error types
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
