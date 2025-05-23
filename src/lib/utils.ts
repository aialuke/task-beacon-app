
/**
 * Core utility functions
 * 
 * This file contains fundamental utility functions used across the application,
 * along with selective re-exports of the most commonly used utilities.
 * 
 * For more specialized utilities, import directly from their respective files:
 * - UI utilities: import { cn } from "@/lib/uiUtils";
 * - Date utilities: import { formatDate } from "@/lib/dateUtils";
 * - Format utilities: import { truncateText } from "@/lib/formatUtils";
 * - Animation utilities: import { animateElement } from "@/lib/animationUtils";
 * - Image utilities: import { compressAndResizePhoto } from "@/lib/imageUtils";
 * - Data utilities: import { sortByProperty } from "@/lib/dataUtils";
 * - Validation utilities: import { isValidEmail } from "@/lib/validationUtils";
 */

// Re-export only the most commonly used utilities
export { cn } from './uiUtils';
export { formatDate, getDaysRemaining, getTimeUntilDue } from './dateUtils';
export { truncateText } from './formatUtils';

/**
 * Deep clones an object using JSON serialization
 * Note: This will not preserve functions or special objects like Date
 * 
 * @param obj - Object to clone
 * @returns A deep copy of the object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Creates a delay using a Promise
 * 
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a UUID v4 string
 * 
 * @returns A random UUID v4 string
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
 * 
 * @param value - Value to check
 * @returns True if the value is empty, false otherwise
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
 * 
 * @param jsonString - JSON string to parse
 * @param defaultValue - Default value to return if parsing fails
 * @returns Parsed JSON object or the default value
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
 * 
 * @param func - The function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
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
 * 
 * @param func - The function to throttle
 * @param limit - The number of milliseconds to throttle invocations to
 * @returns Throttled function
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

