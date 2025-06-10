/**
 * Unified Error Handling System - Phase 1 Consolidation
 * 
 * Consolidates all error handling patterns into a single, unified system.
 * Replaces 6+ fragmented error handling approaches with one consistent API.
 */

import { toast } from 'sonner';

import { formatApiError } from '@/lib/api/error-handling';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/shared';

// === CORE ERROR INTERFACES ===

export interface ErrorOptions {
  /** Show user notification (default: true) */
  showToast?: boolean;
  /** Log to console (default: true) */
  logToConsole?: boolean;
  /** Re-throw after handling (default: false) */
  rethrow?: boolean;
  /** Operation context for logging */
  context?: string;
}

export interface ErrorState {
  error: Error | null;
  hasError: boolean;
  isRecoverable: boolean;
  lastErrorTime?: number;
}

// === UNIFIED ERROR HANDLER ===

/**
 * Central error processing function
 * Handles all error types with consistent behavior
 */
export function handleError(
  error: unknown,
  options: ErrorOptions = {}
): ApiError {
  const {
    showToast = true,
    logToConsole = true,
    rethrow = false,
    context
  } = options;

  // Format error using existing API error formatter
  const apiError = formatApiError(error);
  
  // Log error with context
  if (logToConsole) {
    const errorInstance = error instanceof Error ? error : new Error(apiError.message);
    const logContext = context ? ` [${context}]` : '';
    logger.error(`Error${logContext}:`, errorInstance);
  }

  // Show user notification
  if (showToast) {
    toast.error(apiError.message);
  }

  // Re-throw if requested
  if (rethrow) {
    throw error;
  }

  return apiError;
}

// === ASYNC OPERATION WRAPPER ===

/**
 * Wraps async functions with unified error handling
 */
export function withErrorHandling<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: ErrorOptions = {}
): (...args: TArgs) => Promise<TResult | null> {
  return async (...args: TArgs): Promise<TResult | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      return null;
    }
  };
}

// === GLOBAL ERROR SETUP ===

/**
 * Initialize global error handlers
 */
export function setupGlobalErrorHandling(): void {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, {
      context: 'Unhandled Promise Rejection',
      showToast: false // Don't spam user with global errors
    });
    event.preventDefault();
  });

  // Uncaught errors
  window.addEventListener('error', (event) => {
    handleError(event.error, {
      context: 'Uncaught Error',
      showToast: false // Don't spam user with global errors
    });
  });
}

// === UTILITY FUNCTIONS ===

/**
 * Safe async execution with error handling
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  options: ErrorOptions = {}
): Promise<T | null> {
  try {
    return await asyncFn();
  } catch (error) {
    handleError(error, options);
    return null;
  }
}

/**
 * Create error state object
 */
export function createErrorState(error?: Error | null): ErrorState {
  return {
    error: error || null,
    hasError: !!error,
    isRecoverable: true,
    lastErrorTime: error ? Date.now() : undefined,
  };
}

// === EXPORTS ===

export const ErrorHandler = {
  handle: handleError,
  wrap: withErrorHandling,
  safeAsync,
  setup: setupGlobalErrorHandling,
  createState: createErrorState,
}; 