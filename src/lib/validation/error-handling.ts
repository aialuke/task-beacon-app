/**
 * Standardized error handling utilities for validation
 * 
 * Provides consistent error handling patterns, error transformation,
 * and result creation utilities across all validation modules.
 */

import { 
  BasicValidationResult,
  StandardValidationResult,
  ValidationErrorCode,
  ValidationWarningCode,
  ValidationError,
  ValidationContext,
  StandardValidationDetail,
  isValidationError
} from './types';

/**
 * Creates a successful validation result
 */
export function createSuccessResult(warnings: string[] = []): BasicValidationResult {
  return {
    isValid: true,
    errors: [],
    warnings,
  };
}

/**
 * Creates a failed validation result with errors
 */
export function createErrorResult(
  errors: string | string[],
  warnings: string[] = []
): BasicValidationResult {
  return {
    isValid: false,
    errors: Array.isArray(errors) ? errors : [errors],
    warnings,
  };
}

/**
 * Creates an enhanced validation result with details
 */
export function createStandardResult(
  isValid: boolean,
  details: StandardValidationDetail[] = [],
  context?: ValidationContext
): StandardValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Extract errors and warnings from details
  details.forEach(detail => {
    if (detail.severity === 'error') {
      errors.push(detail.message);
    } else if (detail.severity === 'warning') {
      warnings.push(detail.message);
    }
  });

  return {
    isValid,
    errors,
    warnings,
    details,
    errorCode: !isValid ? details.find(d => d.severity === 'error')?.code as ValidationErrorCode : undefined,
    metadata: {
      validatedAt: new Date(),
      validator: context?.validator || 'unknown',
    },
  };
}

/**
 * Creates a validation detail with standard formatting
 */
export function createValidationDetail(
  code: ValidationErrorCode | ValidationWarningCode,
  message: string,
  field?: string,
  value?: unknown,
  severity: 'error' | 'warning' | 'info' = 'error'
): StandardValidationDetail {
  return {
    field,
    code,
    message,
    severity,
    value,
    context: {
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Standard error messages for common validation scenarios
 */
export const StandardErrorMessages = {
  [ValidationErrorCode.REQUIRED]: 'This field is required',
  [ValidationErrorCode.INVALID_FORMAT]: 'Invalid format',
  [ValidationErrorCode.INVALID_EMAIL]: 'Invalid email format',
  [ValidationErrorCode.INVALID_URL]: 'Invalid URL format. Must start with http:// or https://',
  [ValidationErrorCode.TOO_SHORT]: 'Value is too short',
  [ValidationErrorCode.TOO_LONG]: 'Value is too long',
  [ValidationErrorCode.INVALID_DATE]: 'Invalid date format',
  [ValidationErrorCode.DATE_IN_PAST]: 'Date cannot be in the past',
  [ValidationErrorCode.NOT_FOUND]: 'Resource not found',
  [ValidationErrorCode.ALREADY_EXISTS]: 'Resource already exists',
  [ValidationErrorCode.DATABASE_ERROR]: 'Database validation failed',
  [ValidationErrorCode.CONNECTION_ERROR]: 'Database connection failed',
  [ValidationErrorCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions for this operation',
  [ValidationErrorCode.BUSINESS_RULE_VIOLATION]: 'Business rule violation',
  [ValidationErrorCode.FORBIDDEN_OPERATION]: 'Operation not allowed',
  [ValidationErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred',
  [ValidationErrorCode.VALIDATION_FAILED]: 'Validation failed',
} as const;

/**
 * Standard warning messages for common scenarios
 */
export const StandardWarningMessages = {
  [ValidationWarningCode.APPROACHING_LIMIT]: 'Approaching character limit',
  [ValidationWarningCode.UNUSUAL_VALUE]: 'Unusual value detected',
  [ValidationWarningCode.DEPRECATED_FORMAT]: 'Format is deprecated but still supported',
  [ValidationWarningCode.PERFORMANCE_WARNING]: 'Operation may take longer than usual',
  [ValidationWarningCode.TEMPORARY_ISSUE]: 'Temporary issue detected',
} as const;

/**
 * Gets a standard error message for a given error code
 */
export function getStandardMessage(
  code: ValidationErrorCode | ValidationWarningCode,
  customMessage?: string
): string {
  if (customMessage) return customMessage;
  
  return StandardErrorMessages[code as ValidationErrorCode] || 
         StandardWarningMessages[code as ValidationWarningCode] || 
         'Unknown validation issue';
}

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

/**
 * Combines multiple validation results into a single result
 */
export function combineValidationResults(
  results: BasicValidationResult[]
): BasicValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  let isValid = true;

  results.forEach(result => {
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    if (!result.isValid) {
      isValid = false;
    }
  });

  return {
    isValid,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Converts a basic result to a standard result with enhanced details
 */
export function enhanceValidationResult(
  basicResult: BasicValidationResult,
  context: ValidationContext
): StandardValidationResult {
  const details: StandardValidationDetail[] = [];

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