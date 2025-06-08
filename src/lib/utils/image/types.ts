/**
 * Image Utilities Type Definitions
 * 
 * All TypeScript interfaces and type definitions for the image utilities system.
 * This module provides type safety and clear contracts for image processing operations.
 */

/**
 * Enhanced image processing options
 */
export interface EnhancedImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpeg' | 'png';
  preserveAspectRatio?: boolean;
  enableSmoothing?: boolean;
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

/**
 * Enhanced validation options with detailed feedback
 */
export interface EnhancedImageValidationOptions {
  maxSize?: number;
  minSize?: number;
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  allowedAspectRatios?: { min: number; max: number }[];
}

/**
 * Detailed validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
  details?: {
    fileSize: string;
    dimensions: string;
    type: string;
    aspectRatio: number;
  };
}

/**
 * Comprehensive image metadata
 */
export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  type: string;
  name: string;
  lastModified: number;
  aspectRatio: number;
  megapixels: number;
  hasAlphaChannel: boolean;
  isAnimated?: boolean;
  colorSpace?: string;
}

/**
 * Image processing result
 */
export interface ProcessingResult {
  blob: Blob;
  metadata: ImageMetadata;
  compressionStats: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    sizeSavedBytes: number;
    sizeSavedPercent: number;
  };
  processingTime: number;
}

/**
 * Batch processing options
 */
export interface BatchProcessingOptions extends EnhancedImageProcessingOptions {
  onProgress?: (completed: number, total: number, currentFile: string) => void;
  onError?: (error: Error, file: File) => void;
  concurrency?: number;
}

/**
 * WebP support information
 */
export interface WebPSupport {
  basic: boolean;
  lossless: boolean;
  alpha: boolean;
  animation: boolean;
  full: boolean;
}

/**
 * Image conversion result
 */
export interface ConversionResult {
  blob: Blob;
  format: 'webp' | 'jpeg';
  supportsWebP: boolean;
}

/**
 * Image preview with cleanup utilities
 */
export interface ImagePreview {
  url: string;
  revoke: () => void;
  isRevoked: () => boolean;
}

/**
 * Dimension calculation result
 */
export interface DimensionResult {
  width: number;
  height: number;
  scale: number;
  aspectRatio: number;
} // CodeRabbit review
// CodeRabbit review
