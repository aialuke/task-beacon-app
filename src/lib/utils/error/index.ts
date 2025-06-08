
/**
 * Unified Error Handling Module
 * 
 * Provides a clean API for all error handling needs.
 * Updated to use consolidated error handling from api/error-handling.ts
 */

// Global error handling
export { setupGlobalErrorHandlers } from './global-handlers';

// Consolidated API error handling (moved to api layer)
export {
  handleApiError,
  handleAuthError,
  handleValidationError,
  formatApiError,
  apiRequest,
  logApiError,
  type ErrorHandlingOptions,
  type ProcessedError,
} from '@/lib/api/error-handling';

// Async utilities
export {
  safeAsync,
  withErrorHandling,
} from './async-utilities';

// Legacy compatibility - remove references to deleted api-handlers
export const errorUtils = {
  setupGlobalErrorHandlers: () => import('./global-handlers').then(m => { m.setupGlobalErrorHandlers(); }),
  handleApiError: (error: unknown, operation?: string, options = {}) => 
    import('@/lib/api/error-handling').then(m => m.handleApiError(error, operation, options)),
  handleAuthError: (error: unknown, operation: string) =>
    import('@/lib/api/error-handling').then(m => m.handleAuthError(error, operation)),
  handleValidationError: (error: unknown, fieldName: string) =>
    import('@/lib/api/error-handling').then(m => m.handleValidationError(error, fieldName)),
  safeAsync: <T>(asyncFn: () => Promise<T>, errorMessage?: string, options = {}) =>
    import('./async-utilities').then(m => m.safeAsync(asyncFn, errorMessage, options)),
  withErrorHandling: <TArgs extends unknown[], TRes>(
    fn: (...args: TArgs) => Promise<TRes>,
    errorMessage?: string,
    options = {}
  ) => import('./async-utilities').then(m => m.withErrorHandling(fn, errorMessage, options)),
};
