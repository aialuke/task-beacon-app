
/**
 * Global Error Handling Setup
 * 
 * Handles unhandled errors and promise rejections at the application level.
 */

import { logger } from '@/lib/logger';

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
}
// CodeRabbit review
// CodeRabbit review
