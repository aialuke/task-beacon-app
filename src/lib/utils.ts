
/**
 * @deprecated - Use direct imports from specific utility modules instead
 * 
 * This file is kept for backward compatibility only.
 * For new code, prefer importing directly from specific modules:
 * 
 * @example
 * // Instead of:
 * import { formatDate } from '@/lib/utils';
 * 
 * // Use:
 * import { formatDate } from '@/lib/utils/date';
 * 
 * This approach provides better tree-shaking and clearer dependencies.
 */

// Re-export most commonly used utilities only
export { cn } from './utils/ui';
export { formatDate } from './utils/date';
export { truncateText } from './utils/format';
export { generateUUID, debounce } from './utils/core';
export { isEmpty, safeJsonParse } from './utils/data';

// Encourage migration to direct imports
console.warn(
  'Consider migrating to direct imports from @/lib/utils/* modules for better performance'
);
