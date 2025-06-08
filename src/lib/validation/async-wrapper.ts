
/**
 * Async Validation Wrapper
 * 
 * Focused on handling async validation operations safely.
 */

import { 
  BasicValidationResult,
  ValidationContext,
  ValidationErrorCode,
  isValidationError,
} from './types';
import { createErrorResult, createValidationDetail } from './result-creators';

/**
 * Wraps async operations with consistent error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: ValidationContext,
  fallbackErrorCode: ValidationErrorCode = ValidationErrorCode.UNKNOWN_ERROR
): Promise<{ success: true; data: T } | { success: false; result: BasicValidationResult }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    // Handle ValidationError instances
    if (isValidationError(error)) {
      return {
        success: false,
        result: createErrorResult(error.message, []),
      };
    }

    // Handle standard errors
    if (error instanceof Error) {
      const detail = createValidationDetail(
        fallbackErrorCode,
        error.message,
        context.field,
        undefined,
        'error'
      );
      
      return {
        success: false,
        result: {
          isValid: false,
          errors: [error.message],
          warnings: [],
        },
      };
    }

    // Handle unknown errors
    const detail = createValidationDetail(
      ValidationErrorCode.UNKNOWN_ERROR,
      'An unexpected error occurred',
      context.field,
      undefined,
      'error'
    );

    return {
      success: false,
      result: createErrorResult('An unexpected error occurred'),
    };
  }
}
// CodeRabbit review
// CodeRabbit review
