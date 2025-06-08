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
// ENHANCED UTILITIES (Available - Refactored & Migrated)
// =====================================================

// Export image types separately using 'export type'
export type {
  EnhancedImageProcessingOptions,
  EnhancedImageValidationOptions,
  ImageMetadata,
  ProcessingResult,
  WebPSupport,
  ConversionResult,
  ImagePreview,
  DimensionResult,
} from './image';

// Export image runtime values
export {
  DEFAULT_ENHANCED_VALIDATION,
  DEFAULT_PROCESSING_OPTIONS,
  WEBP_TEST_IMAGES,
  IMAGE_MIME_TYPES,
  FILE_SIZE,
  DIMENSION_PRESETS,
  QUALITY_PRESETS,
  WebPDetector,
  webpDetector,
  validateImageEnhanced,
  validateImageQuick,
  validateImagesEnhanced,
  areAllValidationResultsValid,
  getValidationErrors,
  getValidationWarnings,
  extractImageMetadataEnhanced,
  extractImageDimensions,
  calculateAspectRatio,
  calculateMegapixels,
  supportsAlphaChannel,
  supportsAnimation,
  getReadableFileSize,
  processImageEnhanced,
  getOptimalImageFormatAdvanced,
  calculateOptimalDimensions,
  processImageWithCanvas,
  resizeImageExact,
  compressAndResizePhoto,
  generateThumbnailEnhanced,
  convertToWebPWithFallback,
  resizeImage,
  compressImage,
  createSquareThumbnail,
  convertImageFormat,
  optimizeForWeb,
  createImageSizes,
  createImagePreviewEnhanced,
  cleanupObjectURLs,
  createImagePreviews,
  cleanupImagePreviews,
  createManagedPreview,
  downloadImage,
  downloadImages,
  blobToDataURL,
  copyImageToClipboard,
  ImagePreviewManager,
  IMAGE_UTILS_VERSION,
  BACKWARD_COMPATIBLE,
  MIGRATION_STATUS,
  USAGE_EXAMPLES,
} from './image';

// Image ValidationResult with explicit alias to resolve conflict
export type { ValidationResult as ImageValidationResult } from './image';

// =====================================================
// STANDARDIZED PATTERNS & OPERATIONS
// =====================================================

// Common async patterns and utilities
export {
  executeAsync,
  retryAsync,
  createAsyncHandler,
  debounce,
  throttle,
} from './patterns';

// Pattern-specific types
export type {
  AsyncFunc,
} from './patterns';

// Consolidated modal management
export * from './modal-management';

// Standardized async operation handling
export type {
  AsyncOperationOptions,
  AsyncOperationResult,
} from './async-operations';

export {
  useAsyncOperation as useAsyncOp,
  useBatchAsyncOperation,
  useOptimisticAsyncOperation,
  createAsyncOperationFactory,
  asyncOperationUtils,
} from './async-operations';

// Async operation state with alias to avoid conflict
export type { AsyncOperationState as AsyncOpState } from './async-operations';

// =====================================================
// ENHANCED UTILITIES (Previous Phases)
// =====================================================

// Enhanced validation utilities
export {
  isValidEmail,
  isValidPassword,
  isDateInFuture,
  isValidUserName,
  isValidTaskTitle,
  isValidTaskDescription,
  isValidText,
  validateField,
  validateForm,
} from './validation';

// Validation types with explicit alias to resolve conflict
export type {
  ValidationResult as UtilValidationResult,
} from './validation';

// Enhanced shared utilities - explicitly import only what doesn't conflict
export {
  isValidUrl,
  formatFileSize as formatFileSizeShared,
  truncateUrl as truncateUrlShared,
  formatDate as formatDateShared,
  getDaysRemaining as getDaysRemainingShared,
} from './shared';

// Enhanced error handling
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

// Enhanced utility namespaces
export * as imageUtils from './image';
export * as patternUtils from './patterns';
export * as modalUtils from './modal-management';
export * as asyncUtils from './async-operations';
export * as validationUtilities from './validation';
export * as errorUtils from './error';

// =====================================================
// MIGRATION NOTES
// =====================================================

/**
 * PHASE 4 COMPLETION - ✅ STANDARDIZED PATTERNS & OPERATIONS:
 * 
 * ✅ CREATED: Common async patterns utility (src/lib/utils/patterns.ts)
 * ✅ CREATED: Consolidated modal management (src/lib/utils/modal-management.ts)  
 * ✅ CREATED: Standardized async operations (src/lib/utils/async-operations.ts)
 * ✅ ENHANCED: Main utilities index with new patterns
 * 
 * NEW UTILITIES AVAILABLE:
 * 
 * ASYNC PATTERNS:
 * - executeAsync, retryAsync, createAsyncHandler
 * - debounce, throttle utility functions
 * 
 * MODAL MANAGEMENT:
 * - ModalManagerProvider for centralized modal state
 * - useModalManager, useModal hooks
 * - modalPresets for common modal types
 * - Modal registry for dynamic modal management
 * 
 * ASYNC OPERATIONS:
 * - useAsyncOp with retry and timeout support
 * - useBatchAsyncOperation for parallel operations
 * - useOptimisticAsyncOperation for UI responsiveness
 * - createAsyncOperationFactory for reusable patterns
 * 
 * USAGE EXAMPLES:
 * 
 * Async Patterns:
 * import { patternUtils } from '@/lib/utils';
 * import { executeAsync, debounce } from '@/lib/utils';
 * 
 * Modal Management:
 * import { modalUtils } from '@/lib/utils';
 * import { useModal, ModalManagerProvider } from '@/lib/utils';
 * 
 * Async Operations:
 * import { asyncUtils } from '@/lib/utils';
 * import { useAsyncOp } from '@/lib/utils';
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
 * ✅ PHASE 4: Expanded shared utilities with async patterns
 * ✅ CLEANUP: Removed unused batch processing and enhanced photo upload
 */

// NOTE: Simple Photo Upload components are now directly imported:
// import { SimplePhotoUpload, SimplePhotoUploadModal } from '@/components/form';
// Background processing functionality preserved via useFormPhotoUpload hook.
// CodeRabbit review
// CodeRabbit review
