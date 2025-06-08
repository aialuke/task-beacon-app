
/**
 * Core Validation Utilities
 * 
 * Essential validation functions that complement the centralized Zod schemas.
 * Focused on lightweight, synchronous operations.
 */

// === TYPES ===
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// === BASIC VALIDATION FUNCTIONS ===

/**
 * Generic text validation with configurable limits
 */
export function isValidText(text: string, minLength = 0, maxLength = 1000): boolean {
  if (typeof text !== 'string') return false;
  return text.length >= minLength && text.length <= maxLength;
}

/**
 * Simple email format validation (lightweight)
 */
export function isValidEmailFormat(email: string): boolean {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Basic URL format validation
 */
export function isValidUrlFormat(url: string): boolean {
  if (!url || typeof url !== 'string') return true; // Allow empty URLs
  const trimmed = url.trim();
  if (!trimmed) return true;

  // Check if it has protocol
  if (/^https?:\/\//.test(trimmed)) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }

  // Basic domain pattern
  const domainPattern = /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return domainPattern.test(trimmed);
}

/**
 * Field-specific validation with error messages
 */
export function validateField(fieldName: string, value: unknown): ValidationResult {
  switch (fieldName.toLowerCase()) {
    case 'email':
      if (typeof value !== 'string') return { isValid: false, errors: ['Email must be a string'] };
      const isValid = isValidEmailFormat(value);
      return { isValid, errors: isValid ? [] : ['Invalid email format'] };
    
    case 'title':
      if (typeof value !== 'string') return { isValid: false, errors: ['Title must be a string'] };
      const titleValid = value.length >= 1 && value.length <= 22;
      return { isValid: titleValid, errors: titleValid ? [] : ['Title must be 1-22 characters'] };
    
    case 'url':
      if (typeof value !== 'string') return { isValid: false, errors: ['URL must be a string'] };
      const urlValid = isValidUrlFormat(value);
      return { isValid: urlValid, errors: urlValid ? [] : ['Invalid URL format'] };
    
    default:
      return { isValid: true, errors: [] };
  }
}

/**
 * Simple form validation for multiple fields
 */
export function validateForm(data: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  
  Object.entries(data).forEach(([fieldName, value]) => {
    const fieldResult = validateField(fieldName, value);
    if (!fieldResult.isValid) {
      errors.push(...fieldResult.errors);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
