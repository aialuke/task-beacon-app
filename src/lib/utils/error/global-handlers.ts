
/**
 * Global Error Handling Setup
 * 
 * Consolidates error handling configuration for the entire application.
 */

import { logger } from '@/lib/logger';

/**
 * Setup global error handlers for unhandled errors
 */
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection:', event.reason as Error);
    
    // Prevent the default browser behavior
    event.preventDefault();
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error:', event.error as Error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Handle React error boundary errors (if needed)
  if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      // Check if this is a React error boundary error
      if (args[0] && typeof args[0] === 'string' && args[0].includes('React')) {
        // Create an Error object from the string message
        const errorMessage = args[0] as string;
        const reactError = new Error(errorMessage);
        logger.error('React Error:', reactError, { additionalInfo: args.slice(1) });
      }
      originalConsoleError.apply(console, args);
    };
  }
}
