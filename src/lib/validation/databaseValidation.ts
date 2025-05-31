
import { supabase } from '@/integrations/supabase/client';

/**
 * Database-level validation utilities
 * These functions validate data before sending to the database
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate email format using the same regex as database
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate URL format using the same logic as database
 */
export const validateUrl = (url: string | null | undefined): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Allow empty/null URLs
  if (!url || url.trim() === '') {
    return { isValid: true, errors, warnings };
  }

  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
  if (!urlRegex.test(url)) {
    errors.push('Invalid URL format. Must start with http:// or https://');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate task title according to database constraints
 */
export const validateTaskTitle = (title: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push('Task title is required');
  } else {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 1) {
      errors.push('Task title must be at least 1 character');
    } else if (trimmedTitle.length > 22) {
      errors.push('Task title cannot exceed 22 characters');
    } else if (trimmedTitle.length > 18) {
      warnings.push('Task title is getting long');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate task description according to database constraints
 */
export const validateTaskDescription = (description: string | null | undefined): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (description && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  } else if (description && description.length > 400) {
    warnings.push('Description is getting long');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate user name according to database constraints
 */
export const validateUserName = (name: string | null | undefined): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (name !== null && name !== undefined) {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      errors.push('Name cannot be empty if provided');
    } else if (trimmedName.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    } else if (trimmedName.length > 80) {
      warnings.push('Name is getting long');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate due date to ensure it's not in the past
 */
export const validateDueDate = (dueDate: string | null | undefined): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (dueDate) {
    const date = new Date(dueDate);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    } else if (date < now) {
      errors.push('Due date cannot be in the past');
    } else {
      const timeDiff = date.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        warnings.push('Due date is within 24 hours');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Comprehensive task validation
 */
export const validateTaskData = (taskData: {
  title: string;
  description?: string | null;
  url_link?: string | null;
  due_date?: string | null;
}): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate each field
  const titleResult = validateTaskTitle(taskData.title);
  const descResult = validateTaskDescription(taskData.description);
  const urlResult = validateUrl(taskData.url_link);
  const dateResult = validateDueDate(taskData.due_date);

  // Combine results
  allErrors.push(...titleResult.errors, ...descResult.errors, ...urlResult.errors, ...dateResult.errors);
  allWarnings.push(...titleResult.warnings, ...descResult.warnings, ...urlResult.warnings, ...dateResult.warnings);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};

/**
 * Comprehensive profile validation
 */
export const validateProfileData = (profileData: {
  email: string;
  name?: string | null;
}): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate each field
  const emailResult = validateEmail(profileData.email);
  const nameResult = validateUserName(profileData.name);

  // Combine results
  allErrors.push(...emailResult.errors, ...nameResult.errors);
  allWarnings.push(...emailResult.warnings, ...nameResult.warnings);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};
