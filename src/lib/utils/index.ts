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

// =====================================================
// ENHANCED UTILITIES (Now Available - ✅ REFACTORED & MIGRATED)
// =====================================================

// Enhanced image utilities with WebP support - NOW MODULAR!
// NOTE: All direct imports migrated to specific modules for better tree-shaking
export * from './image';

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

// Enhanced utility namespaces (✅ NOW AVAILABLE - REFACTORED & MIGRATED)
export * as imageUtils from './image';

// New utility namespaces (will be available after Phase 3 migration)
// export * as animationUtils from './animation';
// export * as performanceUtils from './performance';
// export * as errorUtils from './error';
// export * as notificationUtils from './notification';
// export * as navigationUtils from './navigation';
// export * as mobileUtils from './mobile';
// export * as sidebarUtils from './sidebar';
// export * as loggingUtils from './logging';

// =====================================================
// MIGRATION NOTES
// =====================================================

/**
 * IMAGE UTILITIES REFACTORING - ✅ COMPLETED & MIGRATED:
 * 
 * ✅ REFACTORED: Image utilities split into modular architecture
 * ✅ MIGRATED: All imports updated to use direct modular imports
 * ✅ ENHANCED: Tree-shaking optimized with zero backward compatibility overhead
 * ✅ IMPROVED: Better maintainability with focused modules
 * 
 * BEFORE (758 lines, 1 file):
 * - Single monolithic image.ts file
 * - Backward compatible imports from main index
 * 
 * AFTER (10 focused modules, direct imports):
 * - types.ts (129 lines) - Type definitions
 * - constants.ts (99 lines) - Configuration and defaults
 * - webp-detector.ts (126 lines) - WebP feature detection
 * - validation.ts (221 lines) - Image validation logic
 * - metadata.ts (124 lines) - Metadata extraction
 * - processing.ts (282 lines) - Core image processing
 * - convenience.ts (212 lines) - High-level convenience functions
 * - batch.ts (223 lines) - Batch processing utilities
 * - resource-management.ts (221 lines) - URL and resource management
 * - index.ts (231 lines) - Main export barrel
 * 
 * CURRENT USAGE (optimized direct imports):
 * import type { ProcessingResult } from '@/lib/utils/image/types';
 * import { validateImageEnhanced } from '@/lib/utils/image/validation';
 * import { processImageEnhanced } from '@/lib/utils/image/processing';
 * import { compressAndResizePhoto } from '@/lib/utils/image/convenience';
 * 
 * MODULAR IMPORTS (still available for convenience):
 * import { imageProcessing } from '@/lib/utils/image';
 * import { imageValidation } from '@/lib/utils/image';
 * 
 * TREE-SHAKING BENEFITS:
 * - Import only the exact functions needed
 * - Smaller bundle sizes with granular imports
 * - Better development performance with focused modules
 * - Cleaner dependency graphs
 */

/**
 * PHASE 3 MIGRATION STATUS:
 * 
 * ✅ COMPLETED: Enhanced image utilities with WebP support
 * ✅ CREATED: All new utility files have been created
 * ✅ MIGRATED: All imports updated to direct modular structure
 * 📦 READY: Files can be imported directly:
 * 
 * import { imageUtils } from '@/lib/utils';
 * import { animationUtils } from '@/lib/utils/animation';
 * import { performanceUtils } from '@/lib/utils/performance';
 * import { errorUtils } from '@/lib/utils/error';
 * import { notificationUtils } from '@/lib/utils/notification';
 * import { navigationUtils } from '@/lib/utils/navigation';
 * import { mobileUtils } from '@/lib/utils/mobile';
 * import { sidebarUtils } from '@/lib/utils/sidebar';
 * import { loggingUtils } from '@/lib/utils/logging';
 */

// NOTE: Enhanced Photo Upload Modal is now directly imported:
// import EnhancedPhotoUploadModal from '@/components/form/enhanced-photo-upload/EnhancedPhotoUploadModal';
// No backward compatibility exports needed - use direct imports for better tree-shaking.
