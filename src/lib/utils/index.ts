
/**
 * Centralized utility exports
 * 
 * This file provides convenient access to all utility functions
 * organized by domain. Import specific utilities directly for better
 * tree-shaking, or use this index for convenience.
 */

// Re-export the most commonly used utilities for convenience
export { cn } from './ui';
export { formatDate } from './date';
export { truncateText } from './format';

// Domain-specific exports
export * as ui from './ui';
export * as data from './data';
export * as format from './format';
export * as date from './date';
export * as validation from './validation';
export * as core from './core';

// Individual utility exports for direct imports
export { 
  getTaskStatus, 
  getStatusColor, 
  getTimerColor,
  getTimerGradient,
  getStatusTooltipClass,
  getTooltipArrowClass,
  isElementInViewport,
  isDarkMode
} from './ui';

export { 
  sortByProperty, 
  searchByTerm, 
  groupBy, 
  uniqueBy, 
  paginateArray,
  isEmpty,
  safeJsonParse
} from './data';

export { 
  truncateUrl, 
  formatFileSize, 
  formatPercentage 
} from './format';

export { 
  getDaysRemaining, 
  getTimeUntilDue, 
  isDatePast, 
  getDueDateTooltip,
  formatTimeDisplay,
  getTooltipContent,
  getUpdateInterval
} from './date';

export { 
  isValidEmail, 
  isValidUrl, 
  isValidPassword, 
  isDateInFuture 
} from './validation';

export { 
  generateUUID, 
  debounce, 
  throttle 
} from './core';
