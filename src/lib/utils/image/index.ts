
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
 * 
 * // Lazy loading for bundle optimization
 * import { loadImageProcessing } from '@/lib/utils/image/lazy-loader';
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
  WebPSupport,
  ConversionResult,
  ImagePreview,
  DimensionResult,
} from './types';

// ============================================================================
// NOTE: Most image utility exports removed as they were unused
// Individual modules still available for direct import when needed
// ============================================================================

// ============================================================================
// NOTE: All namespace exports and module information removed as unused
// ============================================================================
