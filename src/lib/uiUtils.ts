/**
 * Legacy UI utils file - kept for backward compatibility
 *
 * This file now re-exports from the organized UI utility module.
 * For new code, prefer importing directly from "@/lib/utils/ui"
 */

// Re-export all UI utilities for backward compatibility
export {
  cn,
  getTaskStatus,
  getStatusColor,
  getTimerColor,
  getTimerGradient,
  getStatusTooltipClass,
  getTooltipArrowClass,
  isElementInViewport,
  isDarkMode,
} from './utils/ui';
