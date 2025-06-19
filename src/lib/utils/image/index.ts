/**
 * Image Processing - Unified Entry Point
 *
 * Re-exports all image processing functionality for backward compatibility.
 * Provides a single import point for all image-related operations.
 */

// Types - Only export types that are used externally
export type {
  ProcessingResult,
  EnhancedImageProcessingOptions,
} from './types';

// Unused types removed: ImageMetadata, ConversionResult
// Unused export removed: DEFAULT_PROCESSING_OPTIONS

// Metadata extraction - Only export functions used externally
export { extractImageMetadata } from './metadata';

// Unused export removed: calculateOptimalDimensions

// Unused export removed: processImageEnhanced

// Unused exports removed: getOptimalImageFormat, WebPDetector

// High-level utilities - Only export functions used externally
export { compressAndResizePhoto } from './utils';

// Unused export removed: convertToWebPWithFallback
