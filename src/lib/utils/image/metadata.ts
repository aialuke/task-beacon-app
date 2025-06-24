/**
 * Image Metadata - Metadata Extraction and Analysis
 *
 * Focused utilities for extracting comprehensive metadata from image files.
 * Handles dimension analysis, format detection, and file properties.
 */

import type { ImageMetadata } from './types';

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
 * Calculate optimal dimensions while preserving aspect ratio
 */
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  preserveAspectRatio = true,
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
