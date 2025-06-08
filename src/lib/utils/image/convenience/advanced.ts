
/**
 * Advanced Image Convenience Functions
 * 
 * Complex image operations including thumbnails, optimization, and batch processing.
 */

import { processImageEnhanced } from '../processing/core';

/**
 * Generate thumbnail with enhanced options
 */
export async function generateThumbnailEnhanced(
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
 * Create a square thumbnail (cropped to center)
 */
export async function createSquareThumbnail(
  file: File,
  size: number = 150,
  quality = 0.8
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
 * Optimize image for web (balanced size/quality)
 */
export async function optimizeForWeb(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080
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

  return {
    optimized: optimizedResult.blob,
    thumbnail: thumbnailResult.blob,
    compressionRatio: optimizedResult.compressionStats.compressionRatio,
    sizeSavedPercent: optimizedResult.compressionStats.sizeSavedPercent,
  };
}

/**
 * Create multiple sizes from a single image
 */
export async function createImageSizes(
  file: File,
  sizes: { name: string; width: number; height: number }[],
  quality: number = 0.85
): Promise<{ name: string; blob: Blob; size: number }[]> {
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
