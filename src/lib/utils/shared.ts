
/**
 * Shared Utility Functions - Phase 4 Cleanup
 * 
 * Cleaned up to remove deprecated validation functions that are now handled
 * by the centralized Zod validation system. Only keeps essential utilities.
 */

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

// === DEPRECATED VALIDATION FUNCTIONS - REMOVED ===
// The following validation functions have been moved to the centralized Zod system:
// - isValidEmail -> use emailSchema from @/schemas
// - isValidPassword -> use passwordSchema from @/schemas  
// - isValidUserName -> use userNameSchema from @/schemas
// - isValidTaskTitle -> use taskTitleSchema from @/schemas
// - isValidTaskDescription -> use taskDescriptionSchema from @/schemas
// - isValidUrl -> use urlSchema from @/schemas
// - isDateInFuture -> use futureDateSchema from @/schemas
// - isValidText -> use createTextSchema from @/schemas
// - validateField -> use validateWithZod from @/schemas
// - validateForm -> use validateFormWithZod from @/schemas

// === RE-EXPORT FOR BACKWARD COMPATIBILITY ===
// Import from centralized Zod system for any legacy code that still needs these
export {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isDateInFuture,
  validateWithZod as validateField,
  validateFormWithZod as validateForm,
  type ValidationResult,
} from '@/schemas';
