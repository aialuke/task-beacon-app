
/**
 * Enhanced Error Handling - Phase 2.2 Implementation
 * 
 * Provides comprehensive error handling with recovery strategies.
 */

import { useCallback, useRef } from 'react';
import { useErrorHandler } from '@/hooks/core';

export interface ErrorContext {
  operation: string;
  component: string;
  timestamp?: string;
  userId?: string;
  additional?: Record<string, unknown>;
}

export interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  showUserNotification?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
}

/**
 * Enhanced error handling hook with recovery strategies
 */
export function useEnhancedErrorHandling(
  context: ErrorContext,
  options: ErrorRecoveryOptions = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    showUserNotification = true,
    logToConsole = true,
    reportToService = false,
  } = options;

  const { handleError } = useErrorHandler({
    showToast: showUserNotification,
    logToConsole,
  });

  const retryCountRef = useRef(0);

  const createErrorHandler = useCallback((operationType: string) => {
    return (error: unknown, additionalContext?: Record<string, unknown>) => {
      const enhancedContext = {
        ...context,
        operation: `${context.operation}.${operationType}`,
        timestamp: new Date().toISOString(),
        additional: additionalContext,
      };

      if (logToConsole) {
        console.error(`[${enhancedContext.component}] ${enhancedContext.operation}:`, error, enhancedContext);
      }

      if (reportToService) {
        // Could integrate with error reporting service here
        console.info('Error reported to service:', enhancedContext);
      }

      handleError(
        error instanceof Error ? error : new Error(String(error)),
        `${enhancedContext.component} - ${enhancedContext.operation}`
      );
    };
  }, [context, handleError, logToConsole, reportToService]);

  const createRetryHandler = useCallback((
    operation: () => Promise<unknown>,
    operationType: string
  ) => {
    return async (): Promise<unknown> => {
      try {
        retryCountRef.current = 0;
        return await operation();
      } catch (error) {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCountRef.current));
          
          return operation();
        }
        
        createErrorHandler(operationType)(error, { retryCount: retryCountRef.current });
        throw error;
      }
    };
  }, [maxRetries, retryDelay, createErrorHandler]);

  const resetRetryCount = useCallback(() => {
    retryCountRef.current = 0;
  }, []);

  return {
    createErrorHandler,
    createRetryHandler,
    resetRetryCount,
    retryCount: retryCountRef.current,
  };
}

/**
 * Error boundary integration hook
 */
export function useErrorBoundaryIntegration() {
  const reportError = useCallback((error: Error, errorInfo?: Record<string, unknown>) => {
    console.error('Error Boundary caught error:', error, errorInfo);
    
    // Could integrate with error reporting service here
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }, []);

  return { reportError };
}
