
/**
 * Async Error Handling Utilities
 * 
 * Higher-order functions for safe async operations.
 */

import { handleApiError, type ErrorHandlingOptions } from './api-handlers';

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
// CodeRabbit review
// CodeRabbit review
