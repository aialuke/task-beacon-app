
/**
 * Utility modules - prefer direct imports for better tree-shaking
 * 
 * Instead of: import { formatDate } from '@/lib/utils';
 * Use: import { formatDate } from '@/lib/utils/date';
 * 
 * This file provides commonly used utilities for convenience only.
 */

// Core utilities (most frequently used)
export { cn } from './ui';
export { formatDate, getDaysRemaining } from './date';
export { truncateText } from './format';
export { generateUUID, debounce } from './core';

// For backward compatibility - prefer direct imports in new code
export * from './core';
export * from './date';
export * from './format';
export * from './ui';
export * from './validation';
