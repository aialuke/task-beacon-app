
/**
 * Validation utilities
 * 
 * This file contains utilities for validating data and input.
 */

/**
 * Validates an email address format
 * 
 * @param email - Email to validate
 * @returns True if the email format is valid
 */
export function isValidEmail(email: string): boolean {
  // RFC 5322 compliant email regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Validates a URL format
 * 
 * @param url - URL to validate
 * @returns True if the URL format is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a password strength based on common requirements
 * 
 * @param password - Password to validate
 * @returns Object containing validity status and any errors
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
 * 
 * @param value - String to check
 * @returns True if the string contains only alphanumeric characters
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * Validates a date string format
 * 
 * @param dateString - Date string to validate (YYYY-MM-DD)
 * @returns True if the date format is valid
 */
export function isValidDateFormat(dateString: string): boolean {
  // Basic YYYY-MM-DD format check
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

/**
 * Checks if a date is within a valid range
 * 
 * @param date - Date to validate
 * @param minDate - Minimum allowed date (optional)
 * @param maxDate - Maximum allowed date (optional)
 * @returns True if the date is within the valid range
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

