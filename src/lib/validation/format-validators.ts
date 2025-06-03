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

// Re-export for backward compatibility
export type { BasicValidationResult as ValidationResult } from './types';

/**
 * Validate email format using database-compatible regex
 */
export const validateEmail = (
  email: string,
  context?: ValidationContext
): BasicValidationResult => {
  if (!email || email.trim().length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Email is required'));
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.INVALID_EMAIL));
  }

  return createSuccessResult();
};

/**
 * Validate URL format using database-compatible logic
 */
export const validateUrl = (
  url: string | null | undefined,
  context?: ValidationContext
): BasicValidationResult => {
  // Allow empty/null URLs
  if (!url || url.trim() === '') {
    return createSuccessResult();
  }

  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
  if (!urlRegex.test(url)) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.INVALID_URL));
  }

  return createSuccessResult();
};

/**
 * Validate task title according to database constraints
 */
export const validateTaskTitle = (
  title: string,
  context?: ValidationContext
): BasicValidationResult => {
  if (!title || title.trim().length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Task title is required'));
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 1) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.TOO_SHORT, 'Task title must be at least 1 character'));
  }
  
  if (trimmedTitle.length > 22) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.TOO_LONG, 'Task title cannot exceed 22 characters'));
  }
  
  const warnings: string[] = [];
  if (trimmedTitle.length > 18) {
    warnings.push(getStandardMessage(ValidationWarningCode.APPROACHING_LIMIT, 'Task title is getting long'));
  }

  return warnings.length > 0 ? createSuccessResult(warnings) : createSuccessResult();
};

/**
 * Validate task description according to database constraints
 */
export const validateTaskDescription = (
  description: string | null | undefined,
  context?: ValidationContext
): BasicValidationResult => {
  if (description && description.length > 500) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.TOO_LONG, 'Description cannot exceed 500 characters'));
  }
  
  const warnings: string[] = [];
  if (description && description.length > 400) {
    warnings.push(getStandardMessage(ValidationWarningCode.APPROACHING_LIMIT, 'Description is getting long'));
  }

  return warnings.length > 0 ? createSuccessResult(warnings) : createSuccessResult();
};

/**
 * Validate user name according to database constraints
 */
export const validateUserName = (
  name: string | null | undefined,
  context?: ValidationContext
): BasicValidationResult => {
  if (name !== null && name !== undefined) {
    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
      return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Name cannot be empty if provided'));
    }
    
    if (trimmedName.length > 100) {
      return createErrorResult(getStandardMessage(ValidationErrorCode.TOO_LONG, 'Name cannot exceed 100 characters'));
    }
    
    const warnings: string[] = [];
    if (trimmedName.length > 80) {
      warnings.push(getStandardMessage(ValidationWarningCode.APPROACHING_LIMIT, 'Name is getting long'));
    }

    return warnings.length > 0 ? createSuccessResult(warnings) : createSuccessResult();
  }

  return createSuccessResult();
};

/**
 * Validate due date to ensure it's not in the past and provide warnings
 */
export const validateDueDate = (
  dueDate: string | null | undefined,
  context?: ValidationContext
): BasicValidationResult => {
  if (!dueDate) {
    return createSuccessResult();
  }

  const date = new Date(dueDate);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.INVALID_DATE));
  }
  
  if (date < now) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.DATE_IN_PAST));
  }
  
  const warnings: string[] = [];
  const timeDiff = date.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  if (hoursDiff < 24) {
    warnings.push(getStandardMessage(ValidationWarningCode.PERFORMANCE_WARNING, 'Due date is within 24 hours'));
  }

  return warnings.length > 0 ? createSuccessResult(warnings) : createSuccessResult();
}; 