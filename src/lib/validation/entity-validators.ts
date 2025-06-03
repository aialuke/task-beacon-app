/**
 * Entity validation orchestrators
 * 
 * These validators combine multiple validation rules to provide complete
 * validation for entities like tasks and user profiles.
 */
import {
  validateEmail,
  validateUrl,
  validateTaskTitle,
  validateTaskDescription,
  validateUserName,
  validateDueDate,
} from './format-validators';
import { 
  BasicValidationResult,
  ValidationContext 
} from './types';
import { 
  combineValidationResults 
} from './error-handling';

// Re-export for backward compatibility
export type { BasicValidationResult as ValidationResult } from './types';

/**
 * Comprehensive task validation
 * 
 * Validates all aspects of task data including title, description, URL, and due date.
 * Combines results from multiple format validators.
 */
export const validateTaskData = (
  taskData: {
    title: string;
    description?: string | null;
    url_link?: string | null;
    due_date?: string | null;
  },
  context?: ValidationContext
): BasicValidationResult => {
  const ctx = { validator: 'validateTaskData', ...context };

  // Validate each field using format validators
  const results = [
    validateTaskTitle(taskData.title, { ...ctx, field: 'title' }),
    validateTaskDescription(taskData.description, { ...ctx, field: 'description' }),
    validateUrl(taskData.url_link, { ...ctx, field: 'url_link' }),
    validateDueDate(taskData.due_date, { ...ctx, field: 'due_date' }),
  ];

  return combineValidationResults(results);
};

/**
 * Comprehensive profile validation
 * 
 * Validates user profile data including email and name.
 * Combines results from multiple format validators.
 */
export const validateProfileData = (
  profileData: {
    email: string;
    name?: string | null;
  },
  context?: ValidationContext
): BasicValidationResult => {
  const ctx = { validator: 'validateProfileData', ...context };

  // Validate each field using format validators
  const results = [
    validateEmail(profileData.email, { ...ctx, field: 'email' }),
    validateUserName(profileData.name, { ...ctx, field: 'name' }),
  ];

  return combineValidationResults(results);
}; 