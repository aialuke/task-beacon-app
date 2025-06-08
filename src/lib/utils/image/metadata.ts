/**
 * Image Metadata Extraction
 * 
 * Comprehensive image metadata extraction utilities.
 * This module provides detailed information about image files including dimensions,
 * file properties, and advanced characteristics.
 */

import type { ImageMetadata } from './types';

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

/**
 * Extract basic image dimensions without full metadata
 */
export async function extractImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const result = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
      URL.revokeObjectURL(img.src);
      resolve(result);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for dimension extraction'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate aspect ratio from dimensions
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Calculate megapixels from dimensions
 */
export function calculateMegapixels(width: number, height: number): number {
  return (width * height) / (1024 * 1024);
}

/**
 * Detect if image type likely supports alpha channel
 */
export function supportsAlphaChannel(mimeType: string): boolean {
  return mimeType === 'image/png' || 
         mimeType === 'image/webp' || 
         mimeType === 'image/gif';
}

/**
 * Detect if image type likely supports animation
 */
export function supportsAnimation(mimeType: string): boolean {
  return mimeType === 'image/gif' || mimeType === 'image/webp';
}

/**
 * Get human-readable file size from metadata
 */
export function getReadableFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
} // CodeRabbit review
