
/**
 * Legacy utils file - kept for backward compatibility
 * 
 * This file now re-exports from the organized utility modules.
 * For new code, prefer importing directly from the specific utility modules:
 * - import { cn, getTaskStatus } from "@/lib/utils/ui";
 * - import { formatDate, getDaysRemaining } from "@/lib/utils/date";
 * - import { truncateText, truncateUrl } from "@/lib/utils/format";
 * - import { sortByProperty, searchByTerm } from "@/lib/utils/data";
 * - import { isValidEmail } from "@/lib/utils/validation";
 */

// Re-export most commonly used utilities for backward compatibility
export { cn } from './utils/ui';
export { formatDate } from './utils/date';
export { truncateText } from './utils/format';
export { generateUUID, debounce, throttle } from './utils/core';
export { isEmpty, safeJsonParse } from './utils/data';
