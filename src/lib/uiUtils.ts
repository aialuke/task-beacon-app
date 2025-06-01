/**
 * Legacy UI utils file - kept for backward compatibility
 *
 * This file now re-exports from the organized UI utility module.
 * For new code, prefer importing directly from "@/lib/utils/ui"
 */

// Re-export only generic UI utilities for backward compatibility
export {
  cn,
  isElementInViewport,
  isDarkMode,
} from './utils/ui';
