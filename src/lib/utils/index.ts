/**
 * Centralized utilities index
 * 
 * This is the main entry point for all utility functions throughout the application.
 * All utilities are organized by category and re-exported from here for consistent imports.
 * 
 * @example
 * ```typescript
 * // Import specific utilities
 * import { formatDate, cn } from '@/lib/utils';
 * 
 * // Import category-specific utilities
 * import { dateUtils, uiUtils } from '@/lib/utils';
 * ```
 */

// =====================================================
// EXISTING UTILITIES (Currently Available)
// =====================================================

// Core utilities (className merging, etc.)
export * from './core';

// UI utilities (variants, styling, etc.)
export * from './ui';

// Data manipulation utilities
export * from './data';

// Date and time utilities
export * from './date';

// Format utilities (currency, numbers, etc.)
export * from './format';

// Validation utilities
export * from './validation';

// =====================================================
// NEW UTILITIES (Available after migration - Phase 3)
// =====================================================

// Animation utilities - migrated to @/lib/utils/animation
// export * from './animation';

// Performance utilities - migrated to @/lib/utils/performance
// export * from './performance';

// Error handling utilities - migrated to @/lib/utils/error
// export * from './error';

// Notification utilities - migrated to @/lib/utils/notification
// export * from './notification';

// Navigation utilities - migrated to @/lib/utils/navigation
// export * from './navigation';

// Image utilities - migrated to @/lib/utils/image
// export * from './image';

// Mobile utilities - migrated to @/lib/utils/mobile
// export * from './mobile';

// Sidebar utilities - migrated to @/lib/utils/sidebar
// export * from './sidebar';

// Logging utilities - migrated to @/lib/utils/logging
// export * from './logging';

// =====================================================
// CATEGORIZED UTILITY NAMESPACES
// =====================================================

/**
 * Categorized utility namespaces for organized imports
 */
export * as dateUtils from './date';
export * as uiUtils from './ui';
export * as dataUtils from './data';
export * as formatUtils from './format';
export * as validationUtils from './validation';

// New utility namespaces (will be available after Phase 3 migration)
// export * as animationUtils from './animation';
// export * as performanceUtils from './performance';
// export * as errorUtils from './error';
// export * as notificationUtils from './notification';
// export * as navigationUtils from './navigation';
// export * as imageUtils from './image';
// export * as mobileUtils from './mobile';
// export * as sidebarUtils from './sidebar';
// export * as loggingUtils from './logging';

// =====================================================
// MIGRATION NOTES
// =====================================================

/**
 * PHASE 3 MIGRATION STATUS:
 * 
 * ✅ CREATED: All new utility files have been created
 * 🔄 PENDING: Import updates throughout codebase
 * 📦 READY: Files can be imported directly:
 * 
 * import { animationUtils } from '@/lib/utils/animation';
 * import { performanceUtils } from '@/lib/utils/performance';
 * import { errorUtils } from '@/lib/utils/error';
 * import { notificationUtils } from '@/lib/utils/notification';
 * import { navigationUtils } from '@/lib/utils/navigation';
 * import { imageUtils } from '@/lib/utils/image';
 * import { mobileUtils } from '@/lib/utils/mobile';
 * import { sidebarUtils } from '@/lib/utils/sidebar';
 * import { loggingUtils } from '@/lib/utils/logging';
 */
