
/**
 * Format validation utilities
 * 
 * Pure functions for validating data formats, field constraints, and basic rules.
 * These validators can be used on both client and server side without dependencies.
 */

import { 
  BasicValidationResult,
  ValidationErrorCode,
  ValidationWarningCode,
  ValidationContext 
} from './types';
import { 
  createSuccessResult,
  createErrorResult,
  getStandardMessage 
} from './error-handling';

/**
 * Validate email address format
 */
export const validateEmail = (
  email: string,
  context?: ValidationContext
): BasicValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim().length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Email is required'));
  }
  
  if (!emailRegex.test(email)) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.INVALID_FORMAT, 'Invalid email format'));
  }
  
  const warnings: string[] = [];
  if (email.length > 100) {
    warnings.push(getStandardMessage(ValidationWarningCode.UNUSUAL_VALUE, 'Email address is unusually long'));
  }

  return warnings.length > 0 ? createSuccessResult(warnings) : createSuccessResult();
};

/**
 * Validate user name according to requirements
 */
export const validateUserName = (
  name: string,
  context?: ValidationContext
): BasicValidationResult => {
  if (!name || name.trim().length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Name is required'));
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.TOO_SHORT, 'Name must be at least 2 characters'));
  }
  
  if (trimmedName.length > 100) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.TOO_LONG, 'Name cannot exceed 100 characters'));
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.INVALID_FORMAT, 'Name contains invalid characters'));
  }

  return createSuccessResult();
};

/**
 * Validate URL format
 */
export const validateUrl = (
  url: string | null | undefined,
  context?: ValidationContext
): BasicValidationResult => {
  // Empty URLs are valid
  if (!url || url.trim().length === 0) {
    return createSuccessResult();
  }

  try {
    new URL(url);
    return createSuccessResult();
  } catch {
    return createErrorResult(getStandardMessage(ValidationErrorCode.INVALID_FORMAT, 'Invalid URL format'));
  }
};

/**
 * Validate due date
 */
export const validateDueDate = (
  dueDate: string | null | undefined,
  context?: ValidationContext
): BasicValidationResult => {
  // Empty dates are valid
  if (!dueDate) {
    return createSuccessResult();
  }

  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.INVALID_FORMAT, 'Invalid date format'));
  }

  const warnings: string[] = [];
  const now = new Date();
  const daysDiff = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0) {
    warnings.push(getStandardMessage(ValidationWarningCode.UNUSUAL_VALUE, 'Due date is in the past'));
  } else if (daysDiff > 365) {
    warnings.push(getStandardMessage(ValidationWarningCode.UNUSUAL_VALUE, 'Due date is more than a year away'));
  }

  return warnings.length > 0 ? createSuccessResult(warnings) : createSuccessResult();
};
