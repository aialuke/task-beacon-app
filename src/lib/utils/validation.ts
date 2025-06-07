
/**
 * Legacy Validation Utilities - Deprecated
 * 
 * This file is maintained for backward compatibility.
 * All new code should use the consolidated validation system in shared.ts
 */

// Re-export from the consolidated shared utilities
export {
  isValidEmail,
  isValidPassword,
  isDateInFuture,
  isValidUserName,
  isValidTaskTitle,
  isValidTaskDescription,
  isValidText,
  validateField,
  validateForm,
  formatFileSize,
  type ValidationResult,
} from './shared';

// Legacy alias for backward compatibility
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
