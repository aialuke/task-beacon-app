
/**
 * Basic Image Convenience Functions
 * 
 * Simple image operations like resize, compress, and format conversion.
 */

import type { ConversionResult } from '../types';
import { processImageEnhanced } from '../processing/core';
import { WebPDetector } from '../webp-detector';

/**
 * Enhanced version of the original compressAndResizePhoto function
 * Maintains backward compatibility while adding WebP support
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
    format: 'auto', // Will use WebP with JPEG fallback
  });

  // Convert blob back to File to maintain compatibility
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
  quality = 0.8,
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
