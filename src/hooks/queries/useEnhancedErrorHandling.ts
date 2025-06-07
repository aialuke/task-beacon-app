
/**
 * Enhanced Error Handling - Phase 3.3 Implementation
 * 
 * Comprehensive error handling with recovery mechanisms and user-friendly messages.
 */

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export interface ErrorContext {
  operation: string;
  component?: string;
  userId?: string;
  timestamp: string;
  userAgent?: string;
}

export interface ErrorRecoveryOptions {
  retry?: () => void;
  fallback?: () => void;
  navigate?: (path: string) => void;
  refresh?: () => void;
}

export interface EnhancedError {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  context: ErrorContext;
  originalError: unknown;
}

/**
 * Error classification and user message mapping
 */
const ERROR_MAPPINGS = {
  // Network errors
  'NETWORK_ERROR': {
    userMessage: 'Unable to connect. Please check your internet connection.',
    severity: 'medium' as const,
    recoverable: true,
  },
  'TIMEOUT_ERROR': {
    userMessage: 'Request timed out. Please try again.',
    severity: 'medium' as const,
    recoverable: true,
  },
  
  // Authentication errors
  'UNAUTHORIZED': {
    userMessage: 'Your session has expired. Please log in again.',
    severity: 'high' as const,
    recoverable: false,
  },
  'FORBIDDEN': {
    userMessage: 'You don\'t have permission to perform this action.',
    severity: 'high' as const,
    recoverable: false,
  },
  
  // Data errors
  'NOT_FOUND': {
    userMessage: 'The requested item could not be found.',
    severity: 'low' as const,
    recoverable: false,
  },
  'VALIDATION_ERROR': {
    userMessage: 'Please check your input and try again.',
    severity: 'low' as const,
    recoverable: true,
  },
  
  // System errors
  'SERVER_ERROR': {
    userMessage: 'Something went wrong on our end. We\'re working to fix it.',
    severity: 'critical' as const,
    recoverable: true,
  },
  'DATABASE_ERROR': {
    userMessage: 'Unable to save your changes. Please try again.',
    severity: 'high' as const,
    recoverable: true,
  },
  
  // Generic fallback
  'UNKNOWN_ERROR': {
    userMessage: 'An unexpected error occurred. Please try again.',
    severity: 'medium' as const,
    recoverable: true,
  },
} as const;

/**
 * Classifies errors and returns enhanced error object
 */
export function classifyError(
  error: unknown,
  context: Partial<ErrorContext> = {}
): EnhancedError {
  let code = 'UNKNOWN_ERROR';
  let message = 'Unknown error occurred';

  if (error instanceof Error) {
    message = error.message;
    
    // Classify based on error message or type
    if (message.includes('network') || message.includes('fetch')) {
      code = 'NETWORK_ERROR';
    } else if (message.includes('timeout')) {
      code = 'TIMEOUT_ERROR';
    } else if (message.includes('unauthorized') || message.includes('401')) {
      code = 'UNAUTHORIZED';
    } else if (message.includes('forbidden') || message.includes('403')) {
      code = 'FORBIDDEN';
    } else if (message.includes('not found') || message.includes('404')) {
      code = 'NOT_FOUND';
    } else if (message.includes('validation') || message.includes('invalid')) {
      code = 'VALIDATION_ERROR';
    } else if (message.includes('server') || message.includes('500')) {
      code = 'SERVER_ERROR';
    } else if (message.includes('database') || message.includes('query')) {
      code = 'DATABASE_ERROR';
    }
  }

  const mapping = ERROR_MAPPINGS[code as keyof typeof ERROR_MAPPINGS] || ERROR_MAPPINGS.UNKNOWN_ERROR;

  return {
    code,
    message,
    userMessage: mapping.userMessage,
    severity: mapping.severity,
    recoverable: mapping.recoverable,
    context: {
      operation: 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...context,
    },
    originalError: error,
  };
}

/**
 * Hook for enhanced error handling
 */
export function useEnhancedErrorHandling(defaultContext: Partial<ErrorContext> = {}) {
  const handleError = useCallback((
    error: unknown,
    context: Partial<ErrorContext> = {},
    recoveryOptions: ErrorRecoveryOptions = {}
  ) => {
    const enhancedError = classifyError(error, { ...defaultContext, ...context });
    
    // Log error for debugging
    console.error('Enhanced Error:', enhancedError);
    
    // Show user-friendly toast
    toast.error(enhancedError.userMessage, {
      action: enhancedError.recoverable && recoveryOptions.retry ? {
        label: 'Try Again',
        onClick: recoveryOptions.retry,
      } : undefined,
    });
    
    // Handle specific recovery actions
    if (!enhancedError.recoverable) {
      if (enhancedError.code === 'UNAUTHORIZED' && recoveryOptions.navigate) {
        recoveryOptions.navigate('/auth');
      } else if (enhancedError.code === 'NOT_FOUND' && recoveryOptions.fallback) {
        recoveryOptions.fallback();
      }
    }
    
    return enhancedError;
  }, [defaultContext]);

  const createErrorHandler = useCallback((
    operation: string,
    recoveryOptions: ErrorRecoveryOptions = {}
  ) => {
    return (error: unknown) => handleError(error, { operation }, recoveryOptions);
  }, [handleError]);

  return {
    handleError,
    createErrorHandler,
    classifyError: useCallback((error: unknown, context?: Partial<ErrorContext>) => 
      classifyError(error, { ...defaultContext, ...context }), [defaultContext]),
  };
}

/**
 * Error boundary integration hook
 */
export function useErrorBoundaryIntegration() {
  const { handleError } = useEnhancedErrorHandling();

  const reportError = useCallback((error: Error, errorInfo?: { componentStack: string }) => {
    handleError(error, {
      operation: 'render',
      component: errorInfo?.componentStack?.split('\n')[1]?.trim(),
    });
  }, [handleError]);

  return { reportError };
}
