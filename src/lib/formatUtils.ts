
/**
 * Legacy format utils file - kept for backward compatibility
 * 
 * This file now re-exports from the organized format utility module.
 * For new code, prefer importing directly from "@/lib/utils/format"
 */

// Re-export all format utilities for backward compatibility
export {
  truncateText,
  truncateUrl,
  formatFileSize,
  formatPercentage
} from './utils/format';
