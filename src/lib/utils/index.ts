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
// PHASE 4 UTILITIES (✅ NEW - Common React Patterns & Operations)
// =====================================================

// Common React patterns and HOCs
export * from './patterns';

// Consolidated modal management
export * from './modal-management';

// Standardized async operation handling  
export * from './async-operations';

// =====================================================
// ENHANCED UTILITIES (Available - Previous Phases)
// =====================================================

// Enhanced validation utilities (Phase 2)
export * from './validation';

// Enhanced shared utilities (Phase 2)
export * from './shared';

// Enhanced error handling (Phase 2)
export * from './error';

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

// Phase 4 utility namespaces (✅ NEW)
export * as reactPatterns from './patterns';
export * as modalUtils from './modal-management';
export * as asyncOperationUtils from './async-operations';

// Enhanced utility namespaces (Previous Phases)
export * as validationUtils from './validation';
export * as errorUtils from './error';

// =====================================================
// MIGRATION NOTES
// =====================================================

/**
 * PHASE 4 COMPLETION - ✅ STANDARDIZED PATTERNS & OPERATIONS:
 * 
 * ✅ CREATED: Common React patterns utility (src/lib/utils/patterns.ts)
 * ✅ CREATED: Consolidated modal management (src/lib/utils/modal-management.ts)  
 * ✅ CREATED: Standardized async operations (src/lib/utils/async-operations.ts)
 * ✅ ENHANCED: Main utilities index with new patterns
 * 
 * NEW UTILITIES AVAILABLE:
 * 
 * REACT PATTERNS:
 * - withErrorBoundary, withLoading HOCs
 * - ConditionalRender, DataRenderer components
 * - useEventCallback, useDebouncedCallback hooks
 * - useAsyncOperation, useMount, useUnmount lifecycle hooks
 * 
 * MODAL MANAGEMENT:
 * - ModalManagerProvider for centralized modal state
 * - useModalManager, useModal hooks
 * - modalPresets for common modal types
 * - Modal registry for dynamic modal management
 * 
 * ASYNC OPERATIONS:
 * - useAsyncOperation with retry and timeout support
 * - useBatchAsyncOperation for parallel operations
 * - useOptimisticAsyncOperation for UI responsiveness
 * - createAsyncOperationFactory for reusable patterns
 * 
 * USAGE EXAMPLES:
 * 
 * React Patterns:
 * import { reactPatterns } from '@/lib/utils';
 * import { withErrorBoundary, useAsyncOperation } from '@/lib/utils/patterns';
 * 
 * Modal Management:
 * import { modalUtils } from '@/lib/utils';
 * import { useModal, ModalManagerProvider } from '@/lib/utils/modal-management';
 * 
 * Async Operations:
 * import { asyncOperationUtils } from '@/lib/utils';
 * import { useAsyncOperation } from '@/lib/utils/async-operations';
 * 
 * BENEFITS:
 * - Reduced code duplication across components
 * - Standardized error handling and loading states
 * - Centralized modal state management
 * - Consistent async operation patterns
 * - Improved code maintainability and testing
 */

/**
 * PREVIOUS PHASE COMPLETIONS:
 * 
 * ✅ PHASE 1: Created comprehensive shared utilities
 * ✅ PHASE 2: Consolidated duplicates (validation, modal state, error handling)
 * ✅ PHASE 3: Standardized hook naming conventions
 * ✅ PHASE 4: Expanded shared utilities with React patterns
 */

// NOTE: Enhanced Photo Upload Modal is now directly imported:
// import EnhancedPhotoUploadModal from '@/components/form/enhanced-photo-upload/EnhancedPhotoUploadModal';
// No backward compatibility exports needed - use direct imports for better tree-shaking.
