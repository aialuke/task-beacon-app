
/**
 * Validation Result Creation Utilities
 * 
 * Focused on creating standardized validation results.
 */

import { 
  BasicValidationResult,
  StandardValidationResult,
  ValidationErrorCode,
  ValidationWarningCode,
  ValidationContext,
  StandardValidationDetail,
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
      validator: context?.validator ?? 'unknown',
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
// CodeRabbit review
// CodeRabbit review
