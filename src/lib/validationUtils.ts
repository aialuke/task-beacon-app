
/**
 * Legacy validation utilities - maintained for backward compatibility
 * 
 * @deprecated Consider migrating to the new schema-based validation system
 * from @/schemas/commonValidation and @/hooks/useValidation
 */

// Re-export modern validation utilities for backward compatibility
export { 
  isValidEmail, 
  isValidUrl, 
  isValidPassword,
  isDateInFuture,
  COMMON_VALIDATION_MESSAGES,
  emailSchema,
  passwordSchema,
  urlSchema,
  futureDateSchema,
  createTextSchema
} from "@/schemas/commonValidation";

/**
 * @deprecated Use passwordSchema from commonValidation instead
 */
export function validatePassword(password: string): { 
  isValid: boolean; 
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Checks if a string contains only alphanumeric characters
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * Validates a date string format (YYYY-MM-DD)
 */
export function isValidDateFormat(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

/**
 * Checks if a date is within a valid range
 */
export function isDateInRange(
  date: Date, 
  minDate?: Date, 
  maxDate?: Date
): boolean {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
}
