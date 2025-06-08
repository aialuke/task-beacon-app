
/**
 * Field-Specific Validation Utilities
 * 
 * Validation functions for specific field types used across the application.
 */

// === SPECIALIZED FIELD VALIDATORS ===

/**
 * User name validation with enhanced rules
 */
export function isValidUserName(name: string): boolean {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
}

/**
 * Task title validation with character limit
 */
export function isValidTaskTitle(title: string): boolean {
  if (typeof title !== 'string') return false;
  const trimmed = title.trim();
  return trimmed.length >= 1 && trimmed.length <= 22;
}

/**
 * Task description validation
 */
export function isValidTaskDescription(description: string): boolean {
  if (typeof description !== 'string') return false;
  return description.length <= 500;
}

/**
 * Future date validation
 */
export function isDateInFuture(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') return true; // Allow empty dates
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  const now = new Date();
  return date > now;
}

/**
 * Enhanced URL validation that accepts domains without protocol
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return true; // Allow empty URLs
  
  const trimmed = url.trim();
  if (!trimmed) return true;
  
  // Check if it already has a protocol
  if (/^https?:\/\//.test(trimmed)) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }
  
  // Check for domain pattern without protocol
  const domainPattern = /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return domainPattern.test(trimmed);
}

/**
 * Enhanced email validation
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email.trim())) return false;
  
  // Additional domain validation
  const [, domain] = email.split('@');
  return domain && domain.includes('.') && domain.length > 2;
}

/**
 * Enhanced password validation
 */
export function isValidPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&     // Uppercase letter
    /[a-z]/.test(password) &&     // Lowercase letter
    /[0-9]/.test(password) &&     // Number
    /[^A-Za-z0-9]/.test(password) // Special character
  );
}
