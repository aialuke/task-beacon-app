
/**
 * Main utilities file with common functions and re-exports from specialized utility modules
 * 
 * This file contains:
 * 1. Common utility functions used across the application
 * 2. Re-exports from domain-specific utility files for convenience
 */

// Re-export domain-specific utilities
export * from './uiUtils';
export * from './dateUtils';
export * from './formatUtils';
export * from './animationUtils';
export * from './imageUtils';
export * from './dataUtils';
export * from './validationUtils';

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

