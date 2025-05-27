import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/integrations/supabase/types/api.types";

/**
 * Standardized error handling utilities for the application.
 * 
 * These utilities provide consistent error handling patterns
 * across different parts of the application.
 */

/**
 * Configuration for error handling
 */
export interface ErrorHandlingOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  rethrow?: boolean;
}

const defaultOptions: ErrorHandlingOptions = {
  showToast: true,
  logToConsole: true,
  rethrow: false
};

/**
 * Custom error interface that extends Error with additional properties
 */
interface CustomError extends Error {
  code?: string;
  details?: unknown;
  originalError?: unknown;
}

/**
 * Process API errors in a standardized way
 * 
 * @param error - The error to process
 * @param customMessage - Optional custom message to display instead of the error message
 * @param options - Error handling configuration options
 */
export const handleApiError = (
  error: Error | ApiError | unknown, 
  customMessage?: string,
  options: ErrorHandlingOptions = {}
): CustomError => { // Use CustomError instead of Error
  // Merge with default options
  const opts = { ...defaultOptions, ...options };
  
  let errorMessage = customMessage || "An unexpected error occurred";
  let errorObject: CustomError; // Use CustomError
  
  // Process different error types
  if (error instanceof Error) {
    errorMessage = customMessage || error.message;
    errorObject = error as CustomError; // Cast to CustomError since it extends Error
  } else if (
    typeof error === 'object' && 
    error !== null && 
    'message' in error &&
    typeof error.message === 'string'
  ) {
    // Handle API error objects
    errorMessage = customMessage || error.message;
    errorObject = new Error(errorMessage) as CustomError; // Cast to CustomError
    
    // Copy properties from ApiError
    if ('code' in error) {
      errorObject.code = error.code as string;
    }
    if ('details' in error) {
      errorObject.details = error.details;
    }
  } else {
    // Handle unexpected error types
    errorObject = new Error(errorMessage) as CustomError;
    errorObject.originalError = error;
  }
  
  // Display error toast if enabled
  if (opts.showToast) {
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }
  
  // Log error to console if enabled
  if (opts.logToConsole) {
    console.error("[Error]:", errorMessage, errorObject);
  }
  
  // Rethrow if required
  if (opts.rethrow) {
    throw errorObject;
  }
  
  return errorObject;
};

/**
 * Utility to safely execute async functions with standardized error handling
 * 
 * @param asyncFn - The async function to execute
 * @param errorMessage - Optional custom error message
 * @param options - Error handling options
 * @returns Promise resolving to the function result or null if there was an error
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string,
  options?: ErrorHandlingOptions
): Promise<T | null> {
  try {
    return await asyncFn();
  } catch (error) {
    handleApiError(error, errorMessage, options);
    return null;
  }
}

/**
 * Higher-order function that wraps an async function with error handling
 * 
 * @param fn - The async function to wrap
 * @param errorMessage - Optional custom error message
 * @param options - Error handling options
 * @returns A wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: never[]) => Promise<R>, R>(
  fn: T,
  errorMessage?: string,
  options?: ErrorHandlingOptions
): (...args: Parameters<T>) => Promise<R | null> {
  return async (...args: Parameters<T>): Promise<R | null> => {
    try {
      return await fn(...args); // Now correctly typed as R
    } catch (error) {
      handleApiError(error, errorMessage, options);
      return null;
    }
  };
}