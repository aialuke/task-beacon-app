
/**
 * Enhanced Error Handling Hook
 */

import { useCallback } from 'react';

export interface ErrorHandlingOptions {
  operation: string;
  component: string;
}

export function useEnhancedErrorHandling(options: ErrorHandlingOptions) {
  const createErrorHandler = useCallback((operation: string) => {
    return (error: unknown) => {
      console.error(`Error in ${options.component} - ${operation}:`, error);
    };
  }, [options.component]);

  const reportError = useCallback((error: Error, context?: { componentStack?: string }) => {
    console.error(`Error reported from ${options.component}:`, error, context);
  }, [options.component]);

  return {
    createErrorHandler,
    reportError,
  };
}

export function useErrorBoundaryIntegration() {
  const reportError = useCallback((error: Error, context?: { componentStack?: string }) => {
    console.error('Error boundary integration:', error, context);
  }, []);

  return {
    reportError,
  };
}
