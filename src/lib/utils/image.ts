/**
 * Enhanced Image Utilities with WebP Support
 * 
 * Provides advanced image processing, optimization, and handling utilities
 * with WebP conversion, comprehensive validation, and performance enhancements.
 */

import { logger } from '../logger';
import { formatFileSize } from './shared';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

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
  allowedAspectRatios?: Array<{ min: number; max: number }>;
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

// ============================================================================
// CONSTANTS & DEFAULTS
// ============================================================================

/**
 * Default enhanced validation rules
 */
const DEFAULT_ENHANCED_VALIDATION: Required<EnhancedImageValidationOptions> = {
  maxSize: 10 * 1024 * 1024, // 10MB
  minSize: 1024, // 1KB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  maxWidth: 8192,
  maxHeight: 8192,
  minWidth: 32,
  minHeight: 32,
  allowedAspectRatios: [
    { min: 0.1, max: 10.0 } // Very permissive by default
  ],
};

/**
 * Default processing options
 */
const DEFAULT_PROCESSING_OPTIONS: Required<EnhancedImageProcessingOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'auto',
  preserveAspectRatio: true,
  enableSmoothing: true,
  generateThumbnail: false,
  thumbnailSize: 150,
};

// ============================================================================
// WEBP DETECTION & FEATURE SUPPORT
// ============================================================================

/**
 * Advanced WebP support detection with specific feature testing
 */
export class WebPDetector {
  private static _supportsWebP: boolean | null = null;
  private static _supportsLossless: boolean | null = null;
  private static _supportsAlpha: boolean | null = null;
  private static _supportsAnimation: boolean | null = null;

  /**
   * Test basic WebP support
   */
  static async supportsWebP(): Promise<boolean> {
    if (this._supportsWebP !== null) {
      return this._supportsWebP;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsWebP = webP.height === 2;
        resolve(this._supportsWebP);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Test WebP lossless support
   */
  static async supportsLossless(): Promise<boolean> {
    if (this._supportsLossless !== null) {
      return this._supportsLossless;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsLossless = webP.height === 2;
        resolve(this._supportsLossless);
      };
      webP.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    });
  }

  /**
   * Test WebP alpha channel support
   */
  static async supportsAlpha(): Promise<boolean> {
    if (this._supportsAlpha !== null) {
      return this._supportsAlpha;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsAlpha = webP.height === 2;
        resolve(this._supportsAlpha);
      };
      webP.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';
    });
  }

  /**
   * Test WebP animation support
   */
  static async supportsAnimation(): Promise<boolean> {
    if (this._supportsAnimation !== null) {
      return this._supportsAnimation;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsAnimation = webP.height === 2;
        resolve(this._supportsAnimation);
      };
      webP.src = 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA';
    });
  }

  /**
   * Get comprehensive WebP support info
   */
  static async getWebPSupport() {
    const [basic, lossless, alpha, animation] = await Promise.all([
      this.supportsWebP(),
      this.supportsLossless(),
      this.supportsAlpha(),
      this.supportsAnimation(),
    ]);

    return {
      basic,
      lossless,
      alpha,
      animation,
      full: basic && lossless && alpha,
    };
  }
}

// ============================================================================
// ENHANCED VALIDATION
// ============================================================================

/**
 * Enhanced image validation with detailed feedback
 */
export async function validateImageEnhanced(
  file: File,
  options: EnhancedImageValidationOptions = {}
): Promise<ValidationResult> {
  const opts = { ...DEFAULT_ENHANCED_VALIDATION, ...options };
  const warnings: string[] = [];
  
  try {
    // Basic file checks
    if (!file || !(file instanceof File)) {
      return {
        valid: false,
        error: 'Invalid file object provided',
      };
    }

    // File size validation
    if (file.size > opts.maxSize) {
      return {
        valid: false,
        error: `File size ${formatFileSize(file.size)} exceeds maximum allowed size ${formatFileSize(opts.maxSize)}`,
        details: {
          fileSize: formatFileSize(file.size),
          dimensions: 'Unknown',
          type: file.type,
          aspectRatio: 0,
        },
      };
    }

    if (file.size < opts.minSize) {
      return {
        valid: false,
        error: `File size ${formatFileSize(file.size)} is below minimum required size ${formatFileSize(opts.minSize)}`,
      };
    }

    // File type validation
    if (!opts.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type "${file.type}" is not allowed. Supported types: ${opts.allowedTypes.join(', ')}`,
      };
    }

    // Get image metadata for dimension validation
    const metadata = await extractImageMetadataEnhanced(file);
    
    // Dimension validation
    if (metadata.width > opts.maxWidth || metadata.height > opts.maxHeight) {
      return {
        valid: false,
        error: `Image dimensions ${metadata.width}×${metadata.height} exceed maximum allowed ${opts.maxWidth}×${opts.maxHeight}`,
        details: {
          fileSize: formatFileSize(file.size),
          dimensions: `${metadata.width}×${metadata.height}`,
          type: file.type,
          aspectRatio: metadata.aspectRatio,
        },
      };
    }

    if (metadata.width < opts.minWidth || metadata.height < opts.minHeight) {
      return {
        valid: false,
        error: `Image dimensions ${metadata.width}×${metadata.height} are below minimum required ${opts.minWidth}×${opts.minHeight}`,
      };
    }

    // Aspect ratio validation
    const aspectRatioValid = opts.allowedAspectRatios.some(
      ratio => metadata.aspectRatio >= ratio.min && metadata.aspectRatio <= ratio.max
    );

    if (!aspectRatioValid) {
      const ratioRanges = opts.allowedAspectRatios
        .map(r => `${r.min.toFixed(2)}-${r.max.toFixed(2)}`)
        .join(', ');
      
      return {
        valid: false,
        error: `Image aspect ratio ${metadata.aspectRatio.toFixed(2)} is not within allowed ranges: ${ratioRanges}`,
      };
    }

    // Add warnings for common issues
    if (metadata.megapixels > 12) {
      warnings.push(`High resolution image (${metadata.megapixels.toFixed(1)}MP) may take longer to process`);
    }

    if (file.size > 2 * 1024 * 1024) {
      warnings.push(`Large file size (${formatFileSize(file.size)}) - compression recommended`);
    }

    return {
      valid: true,
      warnings: warnings.length > 0 ? warnings : undefined,
      details: {
        fileSize: formatFileSize(file.size),
        dimensions: `${metadata.width}×${metadata.height}`,
        type: file.type,
        aspectRatio: metadata.aspectRatio,
      },
    };

  } catch (error) {
    logger.error('Error validating image:', error);
    return {
      valid: false,
      error: 'Failed to validate image file',
    };
  }
}

// ============================================================================
// ENHANCED METADATA EXTRACTION
// ============================================================================

/**
 * Extract comprehensive image metadata
 */
export async function extractImageMetadataEnhanced(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const aspectRatio = width / height;
      const megapixels = (width * height) / (1024 * 1024);

      // Detect alpha channel (simplified detection)
      const hasAlphaChannel = file.type === 'image/png' || 
                             file.type === 'image/webp' || 
                             file.type === 'image/gif';

      const metadata: ImageMetadata = {
        width,
        height,
        size: file.size,
        type: file.type,
        name: file.name,
        lastModified: file.lastModified,
        aspectRatio,
        megapixels,
        hasAlphaChannel,
        isAnimated: file.type === 'image/gif', // Simplified detection
      };

      URL.revokeObjectURL(img.src);
      resolve(metadata);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for metadata extraction'));
    };

    img.src = URL.createObjectURL(file);
  });
}

// ============================================================================
// ENHANCED IMAGE PROCESSING
// ============================================================================

/**
 * Get optimal format based on browser support and image characteristics
 */
export async function getOptimalImageFormatAdvanced(
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

  // Fallback logic
  if (file.type === 'image/png') {
    return 'png'; // Preserve PNG for images that need transparency
  }

  return 'jpeg'; // Default fallback
}

/**
 * Calculate optimal dimensions while preserving aspect ratio
 */
function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  preserveAspectRatio: boolean = true
): { width: number; height: number; scale: number } {
  if (!preserveAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight),
      scale: 1,
    };
  }

  const aspectRatio = originalWidth / originalHeight;
  let newWidth = originalWidth;
  let newHeight = originalHeight;
  let scale = 1;

  // Calculate scale factor
  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const scaleX = maxWidth / originalWidth;
    const scaleY = maxHeight / originalHeight;
    scale = Math.min(scaleX, scaleY);
    
    newWidth = Math.round(originalWidth * scale);
    newHeight = Math.round(originalHeight * scale);
  }

  return { width: newWidth, height: newHeight, scale };
}

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
    // Extract metadata first
    const metadata = await extractImageMetadataEnhanced(file);
    
    // Determine optimal format
    const targetFormat = opts.format === 'auto' 
      ? await getOptimalImageFormatAdvanced(file)
      : opts.format === 'webp' 
        ? await WebPDetector.supportsWebP() ? 'webp' : 'jpeg'
        : opts.format as 'jpeg' | 'png' | 'webp';

    // Calculate dimensions
    const { width: newWidth, height: newHeight } = calculateOptimalDimensions(
      metadata.width,
      metadata.height,
      opts.maxWidth,
      opts.maxHeight,
      opts.preserveAspectRatio
    );

    // Process the image
    const blob = await new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          // Configure canvas for high quality
          if (opts.enableSmoothing) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
          }

          // Draw the image
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Convert to blob with optimal format
          const mimeType = `image/${targetFormat}`;
          const quality = targetFormat === 'png' ? undefined : opts.quality;

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob from canvas'));
              }
            },
            mimeType,
            quality
          );
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(img.src);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });

    const processingTime = performance.now() - startTime;

    // Calculate compression stats
    const compressionStats = {
      originalSize: file.size,
      compressedSize: blob.size,
      compressionRatio: blob.size / file.size,
      sizeSavedBytes: file.size - blob.size,
      sizeSavedPercent: ((file.size - blob.size) / file.size) * 100,
    };

    // Update metadata for processed image
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
    throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Enhanced version of the original compressAndResizePhoto function
 * Maintains backward compatibility while adding WebP support
 */
export async function compressAndResizePhoto(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.85
): Promise<File> {
  const result = await processImageEnhanced(file, {
    maxWidth,
    maxHeight,
    quality,
    format: 'auto', // Will use WebP with JPEG fallback
  });

  // Convert blob back to File to maintain compatibility
  return new File([result.blob], file.name, {
    type: result.blob.type,
    lastModified: Date.now(),
  });
}

/**
 * Generate thumbnail with enhanced options
 */
export async function generateThumbnailEnhanced(
  file: File,
  size: number = 150,
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

/**
 * Convert image to WebP with JPEG fallback
 */
export async function convertToWebPWithFallback(
  file: File,
  quality: number = 0.85
): Promise<{ blob: Blob; format: 'webp' | 'jpeg'; supportsWebP: boolean }> {
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

// ============================================================================
// BATCH PROCESSING
// ============================================================================

/**
 * Process multiple images in batch with progress tracking
 */
export async function processImagesBatch(
  files: File[],
  options: BatchProcessingOptions = {}
): Promise<ProcessingResult[]> {
  const { concurrency = 3, onProgress, onError, ...processingOptions } = options;
  const results: ProcessingResult[] = [];
  const errors: Error[] = [];

  // Process files in batches
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    
    const batchPromises = batch.map(async (file, batchIndex) => {
      try {
        const result = await processImageEnhanced(file, processingOptions);
        onProgress?.(i + batchIndex + 1, files.length, file.name);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        onError?.(err, file);
        errors.push(err);
        throw err;
      }
    });

    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });
  }

  if (errors.length > 0 && results.length === 0) {
    throw new Error(`Failed to process any images. First error: ${errors[0].message}`);
  }

  return results;
}

// ============================================================================
// RESOURCE MANAGEMENT
// ============================================================================

/**
 * Create image preview URL with enhanced cleanup
 */
export function createImagePreviewEnhanced(
  file: File,
  autoRevoke: boolean = true,
  revokeDelay: number = 5 * 60 * 1000 // 5 minutes
): { url: string; revoke: () => void; isRevoked: () => boolean } {
  const url = URL.createObjectURL(file);
  let revoked = false;
  
  const revoke = () => {
    if (!revoked) {
      URL.revokeObjectURL(url);
      revoked = true;
    }
  };

  const isRevoked = () => revoked;

  if (autoRevoke) {
    setTimeout(revoke, revokeDelay);
  }

  return { url, revoke, isRevoked };
}

/**
 * Cleanup utility for multiple object URLs
 */
export function cleanupObjectURLs(urls: string[]): void {
  urls.forEach(url => {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.warn('Failed to revoke object URL', { url, error });
    }
  });
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Legacy exports for backward compatibility
 */
export const validateImage = validateImageEnhanced;
export const extractImageMetadata = extractImageMetadataEnhanced;
export const processImage = processImageEnhanced;
export const generateThumbnail = generateThumbnailEnhanced;
export const createImagePreview = createImagePreviewEnhanced;

// Legacy function exports
export const supportsWebP = () => WebPDetector.supportsWebP();
export const getOptimalImageFormat = async (): Promise<'webp' | 'jpeg'> => {
  const supportsWebPResult = await WebPDetector.supportsWebP();
  return supportsWebPResult ? 'webp' : 'jpeg';
};

// Legacy object export for backward compatibility
export const imageUtils = {
  validateImage: validateImageEnhanced,
  processImage: processImageEnhanced,
  generateThumbnail: generateThumbnailEnhanced,
  createImagePreview: createImagePreviewEnhanced,
  extractImageMetadata: extractImageMetadataEnhanced,
  supportsWebP,
  getOptimalImageFormat,
  formatFileSize,
  // Enhanced utilities
  compressAndResizePhoto,
  convertToWebPWithFallback,
  processImagesBatch,
  WebPDetector,
};

// Re-export types
export type { 
  EnhancedImageProcessingOptions as ImageProcessingOptions,
  EnhancedImageValidationOptions as ImageValidationOptions
}; 