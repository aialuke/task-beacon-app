
/**
 * Shared Utility Module
 * 
 * This module consolidates commonly used utility functions from across the codebase
 * to eliminate duplication and provide a single source of truth for shared logic.
 */

// Re-export format utilities
export {
  truncateText,
  truncateUrl,
  formatFileSize,
  formatPercentage,
} from './format';

// Re-export date utilities  
export {
  formatDate,
  getDaysRemaining,
  getTimeUntilDue,
  isDatePast,
  getDueDateTooltip,
  getTooltipContent,
  formatTimeDisplay,
  getUpdateInterval,
} from './date';

// Re-export core utilities
export {
  generateUUID,
  debounce,
  throttle,
} from './core';

// Re-export data manipulation utilities
export {
  sortByProperty,
  searchByTerm,
  groupBy,
  uniqueBy,
  paginateArray,
  isEmpty,
  safeJsonParse,
} from './data';

// Re-export UI utilities
export {
  cn,
  isElementInViewport,
  isDarkMode,
} from './ui';

// Common validation functions (consolidated from deleted validation.ts)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  if (!url || url.length === 0) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date > new Date();
};
