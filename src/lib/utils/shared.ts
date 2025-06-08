
/**
 * Shared Utility Functions - Phase 3.1 Cleanup
 * 
 * Removed duplicate functions that now have canonical sources:
 * - Date functions moved to @/lib/utils/date
 * - Format functions moved to @/lib/utils/format
 * - Validation functions moved to @/schemas
 */

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

// === RE-EXPORT FROM CANONICAL SOURCES ===
// Import from centralized systems for backward compatibility during transition
export {
  formatDate,
  getDaysRemaining,
  getTimeUntilDue,
  isDatePast,
  getDueDateTooltip,
} from './date';

export {
  formatFileSize,
  truncateText,
  formatPercentage,
  formatPrice,
  formatNumber,
} from './format';

export {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isDateInFuture,
  validateWithZod as validateField,
  validateFormWithZod as validateForm,
  type ValidationResult,
} from '@/schemas';
