
/**
 * Error Handling - Refactored Main Module
 * 
 * Provides a unified interface while using focused error handling modules.
 */

// Re-export all error handling utilities from focused modules
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
