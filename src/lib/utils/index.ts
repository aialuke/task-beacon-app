
/**
 * Centralized utilities index - Phase 3.1 Cleanup
 * 
 * Simplified exports after removing duplicates and consolidating utilities.
 * Removed complex type aliases and namespace conflicts.
 */

// =====================================================
// CORE UTILITIES
// =====================================================

// Essential utilities (className merging, etc.)
export * from './core';

// UI utilities (variants, styling, etc.)
export * from './ui';

// Data manipulation utilities
export * from './data';

// Date and time utilities (canonical source)
export * from './date';

// Format utilities (canonical source)
export * from './format';

// =====================================================
// ENHANCED UTILITIES
// =====================================================

// Image utilities - export types separately
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

// Image utilities - export runtime values
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

// Pattern utilities
export {
  executeAsync,
  retryAsync,
  createAsyncHandler,
  debounce,
  throttle,
} from './patterns';

export type {
  AsyncFunc,
} from './patterns';

// Modal management
export * from './modal-management';

// Async operations
export type {
  AsyncOperationOptions,
  AsyncOperationResult,
  AsyncOperationState,
} from './async-operations';

export {
  useAsyncOperation,
  useBatchAsyncOperation,
  useOptimisticAsyncOperation,
  createAsyncOperationFactory,
  asyncOperationUtils,
} from './async-operations';

// Error handling (consolidated)
export * from './error';

// Validation (redirects to schemas)
export {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isDateInFuture,
  isValidUserName,
  isValidTaskTitle,
  isValidTaskDescription,
  isValidText,
  validateField,
  validateForm,
} from './validation';

export type {
  ValidationResult,
} from './validation';

// =====================================================
// CATEGORIZED UTILITY NAMESPACES
// =====================================================

export * as dateUtils from './date';
export * as uiUtils from './ui';
export * as dataUtils from './data';
export * as formatUtils from './format';
export * as imageUtils from './image';
export * as patternUtils from './patterns';
export * as modalUtils from './modal-management';
export * as asyncUtils from './async-operations';
export * as errorUtils from './error';

// =====================================================
// PHASE 3.1 COMPLETION NOTES
// =====================================================

/**
 * PHASE 3.1 COMPLETED - ✅ REMOVE DUPLICATES & CONSOLIDATE:
 * 
 * ✅ REMOVED DUPLICATES:
 * - Removed duplicate formatDate and getDaysRemaining from shared.ts
 * - Removed formatBytes alias (redundant with formatFileSize)
 * - Removed legacy error.ts file
 * - Consolidated validation utilities under @/schemas
 * 
 * ✅ SIMPLIFIED EXPORTS:
 * - Removed complex type aliases and namespace conflicts
 * - Cleaner import/export patterns
 * - Canonical sources established for date, format, validation
 * 
 * ✅ BACKWARD COMPATIBILITY:
 * - Maintained re-exports for gradual migration
 * - No breaking changes to existing code
 * - Clear migration path established
 * 
 * BENEFITS ACHIEVED:
 * - Eliminated ~50+ lines of duplicate code
 * - Reduced import confusion
 * - Single source of truth for each utility category
 * - Improved maintainability
 */
