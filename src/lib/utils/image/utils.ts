/**
 * Image Utilities - High-Level Convenience Functions
 *
 * Provides easy-to-use functions for common image processing tasks.
 * Built on top of the core processing modules for user-friendly API.
 */

import { WebPDetector } from './conversion';
import { processImageEnhanced } from './processing';
import type { ConversionResult } from './types';

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
async function resizeImage(
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
 * Generate thumbnail with enhanced options
 */
async function generateThumbnail(
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

// Re-export commonly used functions for convenience
// Removed: resizeImage, generateThumbnail - no external usage detected
