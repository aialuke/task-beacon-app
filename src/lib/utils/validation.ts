
/**
 * Consolidated Validation Utilities
 * 
 * Single source of truth for all validation functions across the application.
 * Replaces duplicate validation logic in multiple files.
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  if (!password || typeof password !== 'string') return false;
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

// Date validation
export const isDateInFuture = (dateString: string): boolean => {
  if (!dateString) return true; // Allow empty dates
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date > new Date();
};

// User name validation
export const isValidUserName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
};

// Task title validation
export const isValidTaskTitle = (title: string): boolean => {
  if (!title || typeof title !== 'string') return false;
  const trimmed = title.trim();
  return trimmed.length >= 1 && trimmed.length <= 22;
};

// Task description validation
export const isValidTaskDescription = (description: string): boolean => {
  if (!description) return true; // Allow empty descriptions
  return typeof description === 'string' && description.length <= 500;
};

// Generic text validation with configurable limits
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

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Comprehensive validation helper
export const validateField = (
  value: unknown,
  rules: {
    required?: boolean;
    email?: boolean;
    password?: boolean;
    minLength?: number;
    maxLength?: number;
    futureDate?: boolean;
    customValidator?: (value: unknown) => boolean | string;
  }
): ValidationResult => {
  const errors: string[] = [];
  const stringValue = String(value || '');

  // Required validation
  if (rules.required && (!value || stringValue.trim().length === 0)) {
    errors.push('This field is required');
    return { isValid: false, errors };
  }

  // Skip other validations if field is empty and not required
  if (!stringValue.trim() && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // Email validation
  if (rules.email && !isValidEmail(stringValue)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (rules.password && !isValidPassword(stringValue)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
  }

  // Length validation
  if (rules.minLength && stringValue.trim().length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`Cannot exceed ${rules.maxLength} characters`);
  }

  // Future date validation
  if (rules.futureDate && !isDateInFuture(stringValue)) {
    errors.push('Date must be in the future');
  }

  // Custom validation
  if (rules.customValidator) {
    const customResult = rules.customValidator(value);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (customResult === false) {
      errors.push('Validation failed');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Form validation helper
export const validateForm = (
  formData: Record<string, unknown>,
  validationRules: Record<string, Parameters<typeof validateField>[1]>
): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  Object.entries(validationRules).forEach(([fieldName, rules]) => {
    const result = validateField(formData[fieldName], rules);
    if (!result.isValid) {
      errors[fieldName] = result.errors;
      isValid = false;
    }
  });

  return { isValid, errors };
};
