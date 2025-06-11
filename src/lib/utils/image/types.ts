/**
 * Image Types - Type Definitions for Image Processing
 *
 * Centralized type definitions for image processing, metadata, and results.
 * Provides consistent typing across all image-related operations.
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

export interface ConversionResult {
  blob: Blob;
  format: 'webp' | 'jpeg' | 'png';
  supportsWebP: boolean;
}

export interface EnhancedImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpeg' | 'png';
  preserveAspectRatio?: boolean;
  enableSmoothing?: boolean;
}

/**
 * Default processing options
 */
export const DEFAULT_PROCESSING_OPTIONS: Required<EnhancedImageProcessingOptions> =
  {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.85,
    format: 'auto',
    preserveAspectRatio: true,
    enableSmoothing: true,
  };
