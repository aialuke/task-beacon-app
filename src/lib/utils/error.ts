
/**
 * Consolidated Error Handling - Main Entry Point
 * 
 * This module serves as the primary interface for all error handling functionality.
 * It consolidates the refactored error handling modules into a single, unified API.
 * 
 * Phase 3: Error Handling Consolidation - COMPLETED
 * - Unified error handling systems
 * - Maintained all existing functionality
 * - Provided backward compatibility
 */

// === RE-EXPORT ALL ERROR HANDLING FUNCTIONALITY ===
export {
  setupGlobalErrorHandlers,
  handleApiError,
  handleAuthError,
  handleValidationError,
  safeAsync,
  withErrorHandling,
  errorUtils,
  type ErrorHandlingOptions,
  type ProcessedError,
} from './error/index';

// === LEGACY COMPATIBILITY EXPORTS ===
// These ensure existing imports continue to work without changes
export {
  formatApiError,
  apiRequest,
} from '../api/error-handling';

// === UNIFIED ERROR HANDLING API ===
// Consolidated interface that combines all error handling patterns

/**
 * Primary error handling utility - consolidates all patterns
 */
export const consolidatedErrorHandler = {
  // Global setup
  setupGlobal: () => import('./error/global-handlers').then(m => m.setupGlobalErrorHandlers()),
  
  // API error handling
  handleApi: (error: unknown, operation?: string, options = {}) => 
    import('./error/api-handlers').then(m => m.handleApiError(error, operation, options)),
  
  // Auth-specific errors
  handleAuth: (error: unknown, operation: string) =>
    import('./error/api-handlers').then(m => m.handleAuthError(error, operation)),
  
  // Validation errors
  handleValidation: (error: unknown, fieldName: string) =>
    import('./error/api-handlers').then(m => m.handleValidationError(error, fieldName)),
  
  // Async utilities
  safeAsync: <T>(asyncFn: () => Promise<T>, errorMessage?: string, options = {}) =>
    import('./error/async-utilities').then(m => m.safeAsync(asyncFn, errorMessage, options)),
  
  // Higher-order function wrapper
  withErrorHandling: <TArgs extends unknown[], TRes>(
    fn: (...args: TArgs) => Promise<TRes>,
    errorMessage?: string,
    options = {}
  ) => import('./error/async-utilities').then(m => m.withErrorHandling(fn, errorMessage, options)),
  
  // API request wrapper (from API module)
  apiRequest: <T>(operation: string, requestFn: () => Promise<T>) =>
    import('../api/error-handling').then(m => m.apiRequest(operation, requestFn)),
  
  // Error formatting (from API module)
  formatError: (error: unknown) =>
    import('../api/error-handling').then(m => m.formatApiError(error)),
};

/**
 * Backward compatibility - maintains existing errorUtils interface
 * @deprecated Use consolidatedErrorHandler instead for new code
 */
export const legacyErrorUtils = {
  setupGlobalErrorHandlers: () => import('./error/global-handlers').then(m => m.setupGlobalErrorHandlers()),
  handleApiError: (error: unknown, operation?: string, options = {}) => 
    import('./error/api-handlers').then(m => m.handleApiError(error, operation, options)),
  handleAuthError: (error: unknown, operation: string) =>
    import('./error/api-handlers').then(m => m.handleAuthError(error, operation)),
  handleValidationError: (error: unknown, fieldName: string) =>
    import('./error/api-handlers').then(m => m.handleValidationError(error, fieldName)),
  safeAsync: <T>(asyncFn: () => Promise<T>, errorMessage?: string, options = {}) =>
    import('./error/async-utilities').then(m => m.safeAsync(asyncFn, errorMessage, options)),
  withErrorHandling: <TArgs extends unknown[], TRes>(
    fn: (...args: TArgs) => Promise<TRes>,
    errorMessage?: string,
    options = {}
  ) => import('./error/async-utilities').then(m => m.withErrorHandling(fn, errorMessage, options)),
};

// === DEFAULT EXPORT FOR CONVENIENCE ===
export default consolidatedErrorHandler;

/**
 * Quick access functions for common error handling patterns
 */
export const quickError = {
  /**
   * Handle API operation with standard error handling
   */
  api: async <T>(operation: string, requestFn: () => Promise<T>) => {
    const { apiRequest } = await import('../api/error-handling');
    return apiRequest(operation, requestFn);
  },
  
  /**
   * Safe async execution with error handling
   */
  safe: async <T>(asyncFn: () => Promise<T>, errorMessage?: string) => {
    const { safeAsync } = await import('./error/async-utilities');
    return safeAsync(asyncFn, errorMessage);
  },
  
  /**
   * Format any error into a standardized format
   */
  format: async (error: unknown) => {
    const { formatApiError } = await import('../api/error-handling');
    return formatApiError(error);
  },
};
