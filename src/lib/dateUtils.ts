
/**
 * Legacy date utils file - kept for backward compatibility
 * 
 * This file now re-exports from the organized date utility module.
 * For new code, prefer importing directly from "@/lib/utils/date"
 */

// Re-export all date utilities for backward compatibility
export {
  formatDate,
  getDaysRemaining,
  getTimeUntilDue,
  isDatePast,
  getDueDateTooltip,
  formatTimeDisplay,
  getTooltipContent,
  getUpdateInterval
} from './utils/date';
