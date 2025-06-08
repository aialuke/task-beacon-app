
/**
 * Legacy Validation Utilities - Phase 1 Cleanup
 * 
 * This file now serves as a complete redirect to the centralized Zod validation system.
 * All validation logic has been migrated to @/schemas for consistency and type safety.
 */

// === COMPLETE MIGRATION TO ZOD SYSTEM ===
// All validation functions now use the centralized Zod validation system

export {
  // Core validation functions
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isDateInFuture,
  
  // Validation schemas
  emailSchema,
  passwordSchema,
  userNameSchema,
  taskTitleSchema,
  taskDescriptionSchema,
  urlSchema,
  futureDateSchema,
  
  // Validation utilities
  validateWithZod,
  validateFormWithZod,
  
  // Types
  type ValidationResult,
} from '@/schemas';

// === BACKWARD COMPATIBILITY ===
// Simple functions that use the Zod schemas internally
export const isValidUserName = (name: string): boolean => {
  const { userNameSchema } = require('@/schemas');
  const result = userNameSchema.safeParse(name);
  return result.success;
};

export const isValidTaskTitle = (title: string): boolean => {
  const { taskTitleSchema } = require('@/schemas');
  const result = taskTitleSchema.safeParse(title);
  return result.success;
};

export const isValidTaskDescription = (description: string): boolean => {
  const { taskDescriptionSchema } = require('@/schemas');
  const result = taskDescriptionSchema.safeParse(description);
  return result.success;
};

export const isValidText = (
  text: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): boolean => {
  const { minLength = 0, maxLength = 1000, required = false } = options;
  
  if (!text || typeof text !== 'string') {
    return !required;
  }
  
  const trimmed = text.trim();
  
  if (required && trimmed.length === 0) {
    return false;
  }
  
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

// Redirect complex validation to new system
import { validateWithZod, validateFormWithZod } from '@/schemas';
export const validateField = validateWithZod;
export const validateForm = validateFormWithZod;
