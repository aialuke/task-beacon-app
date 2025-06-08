
/**
 * Core Image Processing Functions
 * 
 * Essential image processing operations including format detection and dimension calculations.
 */

import { logger } from '../../../logger';
import type { 
  EnhancedImageProcessingOptions, 
  ProcessingResult, 
  ImageMetadata, 
  DimensionResult 
} from '../types';
import { DEFAULT_PROCESSING_OPTIONS } from '../constants';
import { extractImageMetadataEnhanced } from '../metadata';
import { WebPDetector } from '../webp-detector';

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
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  preserveAspectRatio = true
): DimensionResult {
  const aspectRatio = originalWidth / originalHeight;

  if (!preserveAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight),
      scale: 1,
      aspectRatio,
    };
  }

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

  return { width: newWidth, height: newHeight, scale, aspectRatio };
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

    // Process the image using canvas operations
    const { processImageWithCanvas } = await import('./canvas');
    
    const blob = await processImageWithCanvas(
      file,
      (canvas, ctx, img) => {
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Configure canvas for high quality
        if (opts.enableSmoothing) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }

        // Draw the image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
      },
      targetFormat,
      opts.quality
    );

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
