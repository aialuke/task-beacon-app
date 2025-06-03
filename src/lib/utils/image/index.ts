/**
 * Image Utilities - Main Entry Point
 * 
 * Comprehensive image processing, validation, and utility functions.
 * This module maintains full backward compatibility while providing
 * modular access to specific functionality.
 * 
 * @example
 * ```typescript
 * // Existing imports continue to work
 * import { processImageEnhanced, validateImageEnhanced } from '@/lib/utils/image';
 * 
 * // New modular imports available
 * import { imageValidation, imageProcessing } from '@/lib/utils/image';
 * ```
 */

// ============================================================================
// TYPE EXPORTS - All types available from main import
// ============================================================================
export type {
  EnhancedImageProcessingOptions,
  EnhancedImageValidationOptions,
  ValidationResult,
  ImageMetadata,
  ProcessingResult,
  BatchProcessingOptions,
  WebPSupport,
  ConversionResult,
  ImagePreview,
  DimensionResult,
} from './types';

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================
export {
  DEFAULT_ENHANCED_VALIDATION,
  DEFAULT_PROCESSING_OPTIONS,
  WEBP_TEST_IMAGES,
  IMAGE_MIME_TYPES,
  FILE_SIZE,
  DIMENSION_PRESETS,
  QUALITY_PRESETS,
} from './constants';

// ============================================================================
// WEBP DETECTION
// ============================================================================
export { WebPDetector, webpDetector } from './webp-detector';

// ============================================================================
// IMAGE VALIDATION
// ============================================================================
export {
  validateImageEnhanced,
  validateImageQuick,
  validateImagesEnhanced,
  areAllValidationResultsValid,
  getValidationErrors,
  getValidationWarnings,
} from './validation';

// ============================================================================
// METADATA EXTRACTION
// ============================================================================
export {
  extractImageMetadataEnhanced,
  extractImageDimensions,
  calculateAspectRatio,
  calculateMegapixels,
  supportsAlphaChannel,
  supportsAnimation,
  getReadableFileSize,
} from './metadata';

// ============================================================================
// CORE PROCESSING
// ============================================================================
export {
  processImageEnhanced,
  getOptimalImageFormatAdvanced,
  calculateOptimalDimensions,
  processImageWithCanvas,
  resizeImageExact,
} from './processing';

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================
export {
  compressAndResizePhoto,
  generateThumbnailEnhanced,
  convertToWebPWithFallback,
  resizeImage,
  compressImage,
  createSquareThumbnail,
  convertImageFormat,
  optimizeForWeb,
  createImageSizes,
} from './convenience';

// ============================================================================
// BATCH PROCESSING
// ============================================================================
export {
  processImagesBatch,
  processImagesParallel,
  processImagesSequential,
  createThumbnailsBatch,
  calculateBatchStats,
  processImagesWithRetry,
} from './batch';

// ============================================================================
// RESOURCE MANAGEMENT
// ============================================================================
export {
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
} from './resource-management';

// ============================================================================
// ORGANIZED NAMESPACE EXPORTS
// ============================================================================

/**
 * Organized imports for specific functionality areas
 */

// Type definitions
export * as imageTypes from './types';

// Configuration and constants
export * as imageConstants from './constants';

// WebP detection utilities
export * as imageWebP from './webp-detector';

// Validation utilities
export * as imageValidation from './validation';

// Metadata extraction utilities
export * as imageMetadata from './metadata';

// Core processing utilities
export * as imageProcessing from './processing';

// High-level convenience functions
export * as imageConvenience from './convenience';

// Batch processing utilities
export * as imageBatch from './batch';

// Resource management utilities
export * as imageResources from './resource-management';

// ============================================================================
// MIGRATION HELPERS AND LEGACY SUPPORT
// ============================================================================

/**
 * Legacy function aliases for backward compatibility
 * These ensure that existing code continues to work without changes
 */

// Legacy validation (already exported above, but documented here)
// validateImageEnhanced() - ✅ Available

// Legacy metadata extraction (already exported above)
// extractImageMetadataEnhanced() - ✅ Available

// Legacy processing (already exported above)
// processImageEnhanced() - ✅ Available

// Legacy convenience functions (already exported above)
// compressAndResizePhoto() - ✅ Available
// generateThumbnailEnhanced() - ✅ Available
// convertToWebPWithFallback() - ✅ Available

// Legacy batch processing (already exported above)
// processImagesBatch() - ✅ Available

// Legacy resource management (already exported above)
// createImagePreviewEnhanced() - ✅ Available
// cleanupObjectURLs() - ✅ Available

// ============================================================================
// MODULE INFORMATION
// ============================================================================

/**
 * Module version and compatibility information
 */
export const IMAGE_UTILS_VERSION = '2.0.0';
export const BACKWARD_COMPATIBLE = true;
export const MIGRATION_STATUS = 'COMPLETE';

/**
 * Usage examples and migration guide
 */
export const USAGE_EXAMPLES = {
  basicValidation: `
import { validateImageEnhanced } from '@/lib/utils/image';
const result = await validateImageEnhanced(file);
  `,
  
  basicProcessing: `
import { processImageEnhanced } from '@/lib/utils/image';
const result = await processImageEnhanced(file, { maxWidth: 800 });
  `,
  
  modularImports: `
import { imageValidation, imageProcessing } from '@/lib/utils/image';
const valid = await imageValidation.validateImageEnhanced(file);
const processed = await imageProcessing.processImageEnhanced(file);
  `,
  
  namespacedUsage: `
import * as imageUtils from '@/lib/utils/image';
const validation = await imageUtils.imageValidation.validateImageEnhanced(file);
  `,
} as const; 