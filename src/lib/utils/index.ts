
/**
 * Centralized utilities index - Phase 3.2 File Splitting
 * 
 * Updated to use modular async operations directory and simplified exports.
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

// Async operations (NEW: from modular directory)
export type {
  AsyncOperationOptions,
  AsyncOperationResult,
  AsyncOperationState,
} from './async';

export {
  useAsyncOperation,
  useBatchAsyncOperation,
  useOptimisticAsyncOperation,
  createAsyncOperationFactory,
  asyncOperationUtils,
} from './async';

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
export * as asyncUtils from './async';
export * as errorUtils from './error';

// =====================================================
// PHASE 3.2 COMPLETION NOTES
// =====================================================

/**
 * PHASE 3.2 COMPLETED - ✅ SPLIT OVERSIZED FILES:
 * 
 * ✅ ASYNC OPERATIONS REFACTORING:
 * - Split 369-line async-operations.ts into focused modules
 * - Created src/lib/utils/async/ directory with 4 focused files
 * - Each file under 200 lines with single responsibility
 * - Maintained all existing functionality and exports
 * 
 * ✅ IMPROVED MAINTAINABILITY:
 * - Easier to find and modify specific async operation functionality
 * - Better separation of concerns (core, batch, optimistic, factory)
 * - Reduced cognitive load per file
 * - Maintained backward compatibility
 * 
 * BENEFITS ACHIEVED:
 * - All files now under 200 lines (async-operations.ts eliminated)
 * - Improved code organization and discoverability
 * - Better tree-shaking potential
 * - Easier testing and maintenance
 */
