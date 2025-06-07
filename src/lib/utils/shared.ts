
/**
 * Shared Utility Functions - Centralized Validation
 * 
 * Single source of truth for all validation functions across the application.
 * Consolidates logic from multiple validation files to eliminate duplication.
 */

// === EMAIL VALIDATION ===
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
};

// === PASSWORD VALIDATION ===
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

// === DATE VALIDATION ===
export const isDateInFuture = (dateString: string): boolean => {
  if (!dateString) return true; // Allow empty dates
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date > new Date();
};

// === USER NAME VALIDATION ===
export const isValidUserName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
};

// === TASK VALIDATION ===
export const isValidTaskTitle = (title: string): boolean => {
  if (!title || typeof title !== 'string') return false;
  const trimmed = title.trim();
  return trimmed.length >= 1 && trimmed.length <= 22;
};

export const isValidTaskDescription = (description: string): boolean => {
  if (!description) return true; // Allow empty descriptions
  return typeof description === 'string' && description.length <= 500;
};

// === URL VALIDATION ===
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return true; // Allow empty URLs
  const trimmed = url.trim();
  if (!trimmed) return true;
  
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
};

// === GENERIC TEXT VALIDATION ===
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

// === DATE UTILITIES ===
export const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getDaysRemaining = (dueDateString: string): number | null => {
  if (!dueDateString) return null;
  
  const dueDate = new Date(dueDateString);
  const now = new Date();
  
  if (isNaN(dueDate.getTime())) return null;
  
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// === URL UTILITIES ===
export const truncateUrl = (url: string, maxLength = 30): string => {
  if (!url || typeof url !== 'string') return '';
  
  if (url.length <= maxLength) return url;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    if (domain.length <= maxLength) return domain;
    
    return domain.length > maxLength 
      ? `${domain.substring(0, maxLength - 3)}...`
      : domain;
  } catch {
    return url.length > maxLength 
      ? `${url.substring(0, maxLength - 3)}...`
      : url;
  }
};

// === FILE SIZE FORMATTING ===
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// === VALIDATION RESULT TYPES ===
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// === COMPREHENSIVE VALIDATION HELPER ===
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
    } else if (!customResult) {
      errors.push('Validation failed');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// === FORM VALIDATION HELPER ===
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
