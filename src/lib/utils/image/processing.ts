/**
 * Image Processing - Core Canvas Operations and Processing Logic
 *
 * Handles low-level image processing using HTML5 Canvas.
 * Provides the core processing engine for image manipulation.
 */

import { logger } from '../../logger';

import { getOptimalImageFormat, WebPDetector } from './conversion';
import { extractImageMetadata, calculateOptimalDimensions } from './metadata';
import type {
  ImageMetadata,
  ProcessingResult,
  EnhancedImageProcessingOptions,
} from './types';

/**
 * Process image using canvas operations
 */
async function processImageWithCanvas(
  file: File,
  canvasProcessor: (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
  ) => void,
  format: 'jpeg' | 'png' | 'webp',
  quality: number,
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
          quality,
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
 * Enhanced image processing with WebP conversion and fallback
 */
export async function processImageEnhanced(
  file: File,
  options: EnhancedImageProcessingOptions = {},
): Promise<ProcessingResult> {
  const startTime = performance.now();

  // Import default options to avoid circular dependency
  const { DEFAULT_PROCESSING_OPTIONS } = await import('./types');
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
      opts.preserveAspectRatio,
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
      opts.quality,
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
      `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
