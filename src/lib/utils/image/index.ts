/**
 * Image Processing - Unified Entry Point
 *
 * Re-exports all image processing functionality for backward compatibility.
 * Provides a single import point for all image-related operations.
 */

// Types
export type {
  ImageMetadata,
  ProcessingResult,
  ConversionResult,
  EnhancedImageProcessingOptions,
} from './types';

export { DEFAULT_PROCESSING_OPTIONS } from './types';

// Metadata extraction
export {
  extractImageMetadata,
  extractImageMetadataEnhanced,
  calculateOptimalDimensions,
} from './metadata';

// Core processing
export { processImageEnhanced } from './processing';

// Format conversion
export { getOptimalImageFormat, WebPDetector } from './conversion';

// High-level utilities
export {
  compressAndResizePhoto,
  convertToWebPWithFallback,
  resizeImage,
  generateThumbnail,
} from './utils';
