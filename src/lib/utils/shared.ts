/**
 * Shared Utility Functions - Phase 2 Consolidated
 * 
 * Centralized re-exports of utility functions to eliminate duplication.
 * Single source of truth for commonly used utilities.
 */

// === DATE UTILITIES ===
export {
  formatDate,
  getDaysRemaining,
  getTimeUntilDue,
  isDatePast,
  getDueDateTooltip,
  formatTimeDisplay,
  getTooltipContent,
} from './date';

// === FORMAT UTILITIES ===
export {
  formatFileSize,
  truncateText,
  formatPercentage,
  truncateUrl,
  capitalizeFirst,
  toTitleCase,
} from './format';

// === DATA UTILITIES ===
export {
  sortByProperty,
  searchByTerm,
  groupBy,
  uniqueBy,
  paginateArray,
  safeJsonParse,
} from './data';

// === UI UTILITIES ===
export { cn } from './ui';
