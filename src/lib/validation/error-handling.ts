
/**
 * Validation Error Handling - Refactored
 * 
 * Main orchestrator for validation error handling, using focused modules.
 */

// Re-export focused utilities
export {
  createSuccessResult,
  createErrorResult,
  createStandardResult,
  createValidationDetail,
  combineValidationResults,
} from './result-creators';

export {
  StandardErrorMessages,
  StandardWarningMessages,
  getStandardMessage,
} from './message-constants';

export {
  withErrorHandling,
} from './async-wrapper';

// Enhanced result conversion utility
import { 
  BasicValidationResult,
  StandardValidationResult,
  ValidationContext,
  ValidationErrorCode,
  ValidationWarningCode,
} from './types';
import { createStandardResult, createValidationDetail } from './result-creators';

/**
 * Converts a basic result to a standard result with enhanced details
 */
export function enhanceValidationResult(
  basicResult: BasicValidationResult,
  context: ValidationContext
): StandardValidationResult {
  const details = [];

  // Convert errors to details
  basicResult.errors.forEach(error => {
    details.push(createValidationDetail(
      ValidationErrorCode.VALIDATION_FAILED,
      error,
      context.field,
      undefined,
      'error'
    ));
  });

  // Convert warnings to details
  basicResult.warnings.forEach(warning => {
    details.push(createValidationDetail(
      ValidationWarningCode.UNUSUAL_VALUE,
      warning,
      context.field,
      undefined,
      'warning'
    ));
  });

  return createStandardResult(basicResult.isValid, details, context);
}

/**
 * Sanitizes error messages to prevent information leakage
 */
export function sanitizeErrorMessage(message: string, context?: ValidationContext): string {
  // Remove sensitive information patterns
  const sanitized = message
    .replace(/password/gi, '[SENSITIVE]')
    .replace(/token/gi, '[SENSITIVE]')
    .replace(/secret/gi, '[SENSITIVE]')
    .replace(/key/gi, '[SENSITIVE]');

  return sanitized;
}
