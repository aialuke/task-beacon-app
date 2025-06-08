
/**
 * Validation Message Constants
 * 
 * Centralized validation messages for consistency.
 */

import { ValidationErrorCode, ValidationWarningCode } from './types';

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
// CodeRabbit review
