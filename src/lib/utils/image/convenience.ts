/**
 * High-Level Convenience Functions
 * 
 * User-friendly wrappers for common image processing tasks.
 * This module provides simple interfaces for typical image operations.
 */

import type { ConversionResult } from './types';
import { processImageEnhanced } from './processing';
import { WebPDetector } from './webp-detector';

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
 * Simple image resize maintaining aspect ratio
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number = maxWidth,
  quality: number = 0.85
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
 * Compress image without resizing
 */
export async function compressImage(
  file: File,
  quality: number = 0.8,
  format: 'auto' | 'webp' | 'jpeg' | 'png' = 'auto'
): Promise<Blob> {
  const result = await processImageEnhanced(file, {
    maxWidth: 99999, // Effectively no resize
    maxHeight: 99999,
    quality,
    format,
  });

  return result.blob;
}

/**
 * Create a square thumbnail (cropped to center)
 */
export async function createSquareThumbnail(
  file: File,
  size: number = 150,
  quality: number = 0.8
): Promise<Blob> {
  const result = await processImageEnhanced(file, {
    maxWidth: size,
    maxHeight: size,
    quality,
    format: 'auto',
    preserveAspectRatio: false, // This will crop to exact square
  });

  return result.blob;
}

/**
 * Convert image to specific format
 */
export async function convertImageFormat(
  file: File,
  targetFormat: 'webp' | 'jpeg' | 'png',
  quality: number = 0.85
): Promise<Blob> {
  const result = await processImageEnhanced(file, {
    format: targetFormat,
    quality: targetFormat === 'png' ? 1.0 : quality, // PNG is lossless
  });

  return result.blob;
}

/**
 * Optimize image for web (balanced size/quality)
 */
export async function optimizeForWeb(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<{ 
  optimized: Blob;
  thumbnail: Blob;
  compressionRatio: number;
  sizeSavedPercent: number;
}> {
  // Create optimized version
  const optimizedResult = await processImageEnhanced(file, {
    maxWidth,
    maxHeight,
    quality: 0.85,
    format: 'auto',
  });

  // Create thumbnail
  const thumbnailResult = await processImageEnhanced(file, {
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.8,
    format: 'auto',
  });

  // Calculate size saved percentage
  const originalSize = file.size;
  const compressedSize = optimizedResult.compressedSize;
  const sizeSavedPercent = ((originalSize - compressedSize) / originalSize) * 100;

  return {
    optimized: optimizedResult.blob,
    thumbnail: thumbnailResult.blob,
    compressionRatio: optimizedResult.compressionRatio,
    sizeSavedPercent,
  };
}

/**
 * Create multiple sizes from a single image
 */
export async function createImageSizes(
  file: File,
  sizes: Array<{ name: string; width: number; height: number }>,
  quality: number = 0.85
): Promise<Array<{ name: string; blob: Blob; size: number }>> {
  const results = await Promise.all(
    sizes.map(async ({ name, width, height }) => {
      const result = await processImageEnhanced(file, {
        maxWidth: width,
        maxHeight: height,
        quality,
        format: 'auto',
      });

      return {
        name,
        blob: result.blob,
        size: result.blob.size,
      };
    })
  );

  return results;
}
