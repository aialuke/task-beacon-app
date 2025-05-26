
/**
 * Core utility functions and selective re-exports
 * 
 * This file contains fundamental utility functions used across the application,
 * along with selective re-exports of the most commonly used utilities.
 * 
 * For specialized utilities, import directly from their respective files:
 * - UI utilities: import { cn, getStatusColor } from "@/lib/uiUtils";
 * - Date utilities: import { formatDate, getDaysRemaining } from "@/lib/dateUtils";
 * - Format utilities: import { truncateText, truncateUrl } from "@/lib/formatUtils";
 * - Data utilities: import { sortByProperty, searchByTerm } from "@/lib/dataUtils";
 * - Validation utilities: import { isValidEmail, emailSchema } from "@/schemas/commonValidation";
 */

// === COMMONLY USED RE-EXPORTS ===
// UI utilities (most frequently used)
export { cn, getStatusColor, getTimerColor } from './uiUtils';

// Date utilities (frequently used in tasks)
export { formatDate, getDaysRemaining, getTimeUntilDue } from './dateUtils';

// Format utilities (commonly used for display)
export { truncateText, truncateUrl } from './formatUtils';

// Data utilities (used in filtering and sorting)
export { sortByProperty, searchByTerm } from './dataUtils';

// === CORE UTILITY FUNCTIONS ===

/**
 * Generates a UUID v4 string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
}

/**
 * Safely parses a JSON string, returning a default value if parsing fails
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Debounces a function to limit how often it can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once per specified interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
