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

// Re-export validation utilities
export {
  isValidEmail,
  isValidUrl,
  isValidPassword,
  isDateInFuture,
} from './validation';

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

/**
 * Commonly used type guards
 */
export const typeGuards = {
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number',
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isObject: (value: unknown): value is Record<string, unknown> => 
    typeof value === 'object' && value !== null && !Array.isArray(value),
  isArray: (value: unknown): value is unknown[] => Array.isArray(value),
  isFunction: (value: unknown): value is Function => typeof value === 'function',
  isNotNull: <T>(value: T | null): value is T => value !== null,
  isNotUndefined: <T>(value: T | undefined): value is T => value !== undefined,
  isDefined: <T>(value: T | null | undefined): value is T => 
    value !== null && value !== undefined,
};

/**
 * Async utilities
 */
export const asyncUtils = {
  /**
   * Sleep/delay function
   */
  sleep: (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Timeout a promise
   */
  timeout: <T>(promise: Promise<T>, ms: number): Promise<T> => 
    Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), ms)
      )
    ]),

  /**
   * Retry a promise with exponential backoff
   */
  retry: async <T>(
    fn: () => Promise<T>, 
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i === maxRetries) break;
        
        const delay = baseDelay * Math.pow(2, i);
        await asyncUtils.sleep(delay);
      }
    }
    
    throw lastError!;
  },
};

/**
 * Commonly used constants
 */
export const constants = {
  // File size limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Text length limits
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_URL_LENGTH: 2048,
  
  // Time constants
  MS_PER_SECOND: 1000,
  MS_PER_MINUTE: 60 * 1000,
  MS_PER_HOUR: 60 * 60 * 1000,
  MS_PER_DAY: 24 * 60 * 60 * 1000,
  
  // UI constants
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const;

/**
 * Environment detection
 */
export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isBrowser: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
} as const; 