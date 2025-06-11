/**
 * Consolidated Image Utilities
 *
 * Simplified image processing, validation, and utility functions.
 * Consolidated from multiple nested directories for better maintainability.
 */

import { logger } from '../logger';

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PROCESSING_OPTIONS: Required<EnhancedImageProcessingOptions> = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.85,
  format: 'auto',
  preserveAspectRatio: true,
  enableSmoothing: true,
};

// ============================================================================
// WEBP DETECTION
// ============================================================================

class WebPDetector {
  private static _supportsWebP: boolean | null = null;

  static async supportsWebP(): Promise<boolean> {
    if (this._supportsWebP !== null) {
      return this._supportsWebP;
    }

    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsWebP = webP.height === 2;
        resolve(this._supportsWebP);
      };
      webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }
}

// ============================================================================
// CORE UTILITIES
// ============================================================================

/**
 * Extract comprehensive image metadata
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const aspectRatio = width / height;
      const megapixels = (width * height) / 1000000;

      resolve({
        width,
        height,
        size: file.size,
        type: file.type,
        name: file.name,
        lastModified: file.lastModified,
        aspectRatio,
        megapixels,
        hasAlphaChannel:
          file.type === 'image/png' || file.type === 'image/webp',
        isAnimated: file.type === 'image/gif',
        colorSpace: 'sRGB', // Default assumption
      });
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Process image using canvas operations
 */
async function processImageWithCanvas(
  file: File,
  canvasProcessor: (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement
  ) => void,
  format: 'jpeg' | 'png' | 'webp',
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      try {
        canvasProcessor(canvas, ctx, img);

        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          `image/${format}`,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate optimal dimensions while preserving aspect ratio
 */
function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  preserveAspectRatio = true
): { width: number; height: number } {
  if (!preserveAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight),
    };
  }

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const scaleX = maxWidth / originalWidth;
    const scaleY = maxHeight / originalHeight;
    const scale = Math.min(scaleX, scaleY);

    newWidth = Math.round(originalWidth * scale);
    newHeight = Math.round(originalHeight * scale);
  }

  return { width: newWidth, height: newHeight };
}

/**
 * Get optimal format based on browser support
 */
async function getOptimalImageFormat(
  file: File,
  forceFormat?: 'webp' | 'jpeg' | 'png'
): Promise<'webp' | 'jpeg' | 'png'> {
  if (forceFormat) {
    return forceFormat;
  }

  const webpSupport = await WebPDetector.supportsWebP();

  if (webpSupport) {
    return 'webp';
  }

  if (file.type === 'image/png') {
    return 'png'; // Preserve PNG for images that need transparency
  }

  return 'jpeg'; // Default fallback
}

// ============================================================================
// MAIN PROCESSING FUNCTIONS
// ============================================================================

/**
 * Enhanced image processing with WebP conversion and fallback
 */
export async function processImageEnhanced(
  file: File,
  options: EnhancedImageProcessingOptions = {}
): Promise<ProcessingResult> {
  const startTime = performance.now();
  const opts = { ...DEFAULT_PROCESSING_OPTIONS, ...options };

  try {
    const metadata = await extractImageMetadata(file);

    const targetFormat =
      opts.format === 'auto'
        ? await getOptimalImageFormat(file)
        : opts.format === 'webp'
          ? (await WebPDetector.supportsWebP())
            ? 'webp'
            : 'jpeg'
          : (opts.format as 'jpeg' | 'png' | 'webp');

    const { width: newWidth, height: newHeight } = calculateOptimalDimensions(
      metadata.width,
      metadata.height,
      opts.maxWidth,
      opts.maxHeight,
      opts.preserveAspectRatio
    );

    const blob = await processImageWithCanvas(
      file,
      (canvas, ctx, img) => {
        canvas.width = newWidth;
        canvas.height = newHeight;

        if (opts.enableSmoothing) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);
      },
      targetFormat,
      opts.quality
    );

    const processingTime = performance.now() - startTime;

    const compressionStats = {
      originalSize: file.size,
      compressedSize: blob.size,
      compressionRatio: blob.size / file.size,
      sizeSavedBytes: file.size - blob.size,
      sizeSavedPercent: ((file.size - blob.size) / file.size) * 100,
    };

    const updatedMetadata: ImageMetadata = {
      ...metadata,
      width: newWidth,
      height: newHeight,
      size: blob.size,
      type: `image/${targetFormat}`,
    };

    logger.debug('Image processed successfully', {
      format: targetFormat,
      dimensions: `${newWidth}×${newHeight}`,
      compression: `${compressionStats.sizeSavedPercent.toFixed(1)}%`,
      processingTime: `${processingTime.toFixed(2)}ms`,
    });

    return {
      blob,
      metadata: updatedMetadata,
      compressionStats,
      processingTime,
    };
  } catch (error) {
    logger.error('Error processing image:', error);
    throw new Error(
      `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Enhanced version of the original compressAndResizePhoto function
 */
export async function compressAndResizePhoto(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<File> {
  const result = await processImageEnhanced(file, {
    maxWidth,
    maxHeight,
    quality,
    format: 'auto',
  });

  return new File([result.blob], file.name, {
    type: result.blob.type,
    lastModified: Date.now(),
  });
}

/**
 * Simple image resize maintaining aspect ratio
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number = maxWidth,
  quality = 0.85
): Promise<Blob> {
  const result = await processImageEnhanced(file, {
    maxWidth,
    maxHeight,
    quality,
    format: 'auto',
    preserveAspectRatio: true,
  });

  return result.blob;
}

/**
 * Convert image to WebP with JPEG fallback
 */
export async function convertToWebPWithFallback(
  file: File,
  quality = 0.85
): Promise<ConversionResult> {
  const supportsWebP = await WebPDetector.supportsWebP();

  const result = await processImageEnhanced(file, {
    format: supportsWebP ? 'webp' : 'jpeg',
    quality,
  });

  return {
    blob: result.blob,
    format: supportsWebP ? 'webp' : 'jpeg',
    supportsWebP,
  };
}

/**
 * Generate thumbnail with enhanced options
 */
export async function generateThumbnail(
  file: File,
  size = 150,
  format: 'auto' | 'webp' | 'jpeg' = 'auto'
): Promise<Blob> {
  const result = await processImageEnhanced(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.8,
    format,
    preserveAspectRatio: true,
  });

  return result.blob;
}

// Re-export for backward compatibility
export const extractImageMetadataEnhanced = extractImageMetadata;
