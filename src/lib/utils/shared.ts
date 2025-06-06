/**
 * Shared Utility Module - Standardized Import Patterns
 *
 * This module consolidates commonly used utility functions from across the codebase
 * to eliminate duplication and provide a single source of truth for shared logic.
 */

// === EXTERNAL LIBRARIES ===
// (utilities are dependency-free)

// === INTERNAL UTILITIES ===
// Re-export format utilities
export {
  truncateText,
  truncateUrl,
  formatFileSize,
  formatPercentage,
} from "./format";

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
} from "./date";

// Re-export core utilities
export { generateUUID, debounce, throttle } from "./core";

// Re-export data manipulation utilities
export {
  sortByProperty,
  searchByTerm,
  groupBy,
  uniqueBy,
  paginateArray,
  isEmpty,
  safeJsonParse,
} from "./data";

// Re-export UI utilities
export { cn, isElementInViewport, isDarkMode } from "./ui";

// Re-export validation functions
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
  type ValidationResult,
} from "./validation";
