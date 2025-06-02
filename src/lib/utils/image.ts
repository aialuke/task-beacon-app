/**
 * Image utilities
 * 
 * Provides image processing, optimization, and handling utilities.
 * Migrated from src/lib/imageUtils.ts - use this path going forward.
 */

import { logger } from '../logger';
import { formatFileSize } from './shared';

/**
 * Image processing options
 */
interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * Image validation options
 */
interface ImageValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Default image validation rules
 */
const DEFAULT_VALIDATION: Required<ImageValidationOptions> = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxWidth: 4096,
  maxHeight: 4096,
};

/**
 * Feature detection to determine if Web Workers are supported
 */
export const supportsWebWorker = (): boolean => {
  try {
    return (
      typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined'
    );
  } catch (e) {
    return false;
  }
};

/**
 * Compresses and resizes a photo for upload
 */
async function compressAndResizePhotoImplementation(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      // Create an image object from the file
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        // Calculate the new dimensions
        let width = img.width;
        let height = img.height;

        // Scale down if either dimension exceeds the maximum
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob from image'));
              return;
            }

            // Create a new File object from the blob
            const processedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            // Clean up the object URL
            URL.revokeObjectURL(img.src);

            resolve(processedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Fallback function for environments where Web Workers are not supported
 * @deprecated Use compressAndResizePhoto instead
 */
export async function compressAndResizePhotoFallback(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<File> {
  return compressAndResizePhotoImplementation(file, maxWidth, maxHeight, quality);
}

/**
 * Compresses and resizes a photo for upload
 *
 * This utility function takes a File object (image) and processes it 
 * to compress and resize it to reduce file size while maintaining reasonable quality.
 *
 * @param file - The image File object to process
 * @param maxWidth - Maximum width of the processed image (default: 1200px)
 * @param maxHeight - Maximum height of the processed image (default: 1200px)
 * @param quality - JPEG compression quality (0-1, default: 0.85)
 * @returns A Promise that resolves to a processed File object
 */
export async function compressAndResizePhoto(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<File> {
  return compressAndResizePhotoImplementation(file, maxWidth, maxHeight, quality);
}

/**
 * Validate image file before processing
 */
export function validateImage(
  file: File, 
  options: ImageValidationOptions = {}
): Promise<{ valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    const opts = { ...DEFAULT_VALIDATION, ...options };
    
    // Check file size
    if (file.size > opts.maxSize) {
      const maxSizeMB = (opts.maxSize / (1024 * 1024)).toFixed(1);
      resolve({
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`
      });
      return;
    }
    
    // Check file type
    if (!opts.allowedTypes.includes(file.type)) {
      resolve({
        valid: false,
        error: `File type ${file.type} is not allowed`
      });
      return;
    }
    
    // Check image dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width > opts.maxWidth || img.height > opts.maxHeight) {
        resolve({
          valid: false,
          error: `Image dimensions ${img.width}x${img.height} exceed maximum ${opts.maxWidth}x${opts.maxHeight}`
        });
      } else {
        resolve({ valid: true });
      }
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      resolve({
        valid: false,
        error: 'Invalid image file'
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Resize and compress image while maintaining aspect ratio
 */
export function processImage(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;
    
    const img = new Image();
    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              logger.debug('Image processed successfully', {
                originalSize: file.size,
                newSize: blob.size,
                compression: ((1 - blob.size / file.size) * 100).toFixed(1) + '%',
                dimensions: `${newWidth}x${newHeight}`
              });
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
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;
  
  let newWidth = originalWidth;
  let newHeight = originalHeight;
  
  // Resize if larger than max dimensions
  if (originalWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }
  
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  };
}

/**
 * Generate thumbnail from image file
 */
export function generateThumbnail(
  file: File,
  size: number = 150
): Promise<Blob> {
  return processImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    format: 'jpeg'
  });
}

/**
 * Convert image to different format
 */
export function convertImageFormat(
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality: number = 0.9
): Promise<Blob> {
  return processImage(file, {
    format: targetFormat,
    quality: targetFormat === 'png' ? 1 : quality // PNG doesn't use quality
  });
}

/**
 * Create image preview URL that auto-revokes
 */
export function createImagePreview(
  file: File,
  autoRevoke: boolean = true
): { url: string; revoke: () => void } {
  const url = URL.createObjectURL(file);
  
  const revoke = () => {
    URL.revokeObjectURL(url);
  };
  
  // Auto-revoke after 5 minutes to prevent memory leaks
  if (autoRevoke) {
    setTimeout(revoke, 5 * 60 * 1000);
  }
  
  return { url, revoke };
}

/**
 * Extract EXIF data from image file
 */
export function extractImageMetadata(file: File): Promise<{
  width: number;
  height: number;
  size: number;
  type: string;
  lastModified: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for metadata extraction'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'jpeg' {
  return supportsWebP() ? 'webp' : 'jpeg';
}

// Legacy export for backward compatibility
export const imageUtils = {
  validateImage,
  processImage,
  generateThumbnail,
  convertImageFormat,
  createImagePreview,
  extractImageMetadata,
  supportsWebP,
  getOptimalImageFormat,
  formatFileSize,
};

// Re-export types
export type { ImageProcessingOptions, ImageValidationOptions }; 