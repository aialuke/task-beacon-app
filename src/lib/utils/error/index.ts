
/**
 * Unified Error Handling Module
 * 
 * Provides a clean API for all error handling needs.
 */

// Global error handling
export { setupGlobalErrorHandlers } from './global-handlers';

// API error handling
export {
  handleApiError,
  handleAuthError,
  handleValidationError,
  type ErrorHandlingOptions,
  type ProcessedError,
} from './api-handlers';

// Async utilities
export {
  safeAsync,
  withErrorHandling,
} from './async-utilities';

// Legacy compatibility export
export const errorUtils = {
  setupGlobalErrorHandlers: () => import('./global-handlers').then(m => { m.setupGlobalErrorHandlers(); }),
  handleApiError: (error: unknown, operation?: string, options = {}) => 
    import('./api-handlers').then(m => { m.handleApiError(error, operation, options); }),
  handleAuthError: (error: unknown, operation: string) =>
    import('./api-handlers').then(m => m.handleAuthError(error, operation)),
  handleValidationError: (error: unknown, fieldName: string) =>
    import('./api-handlers').then(m => m.handleValidationError(error, fieldName)),
  safeAsync: <T>(asyncFn: () => Promise<T>, errorMessage?: string, options = {}) =>
    import('./async-utilities').then(m => m.safeAsync(asyncFn, errorMessage, options)),
  withErrorHandling: <TArgs extends unknown[], TRes>(
    fn: (...args: TArgs) => Promise<TRes>,
    errorMessage?: string,
    options = {}
  ) => import('./async-utilities').then(m => m.withErrorHandling(fn, errorMessage, options)),
};
