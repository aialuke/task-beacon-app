/**
 * Batch Image Processing Utilities
 * 
 * Process multiple images efficiently with progress tracking and error handling.
 * This module provides utilities for handling bulk image operations.
 */

import type { BatchProcessingOptions, ProcessingResult } from './types';
import { processImageEnhanced } from './processing';

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

/**
 * Process images in parallel with configurable concurrency
 */
export async function processImagesParallel(
  files: File[],
  processingOptions: Omit<BatchProcessingOptions, 'concurrency' | 'onProgress' | 'onError'> = {},
  concurrency: number = 3
): Promise<ProcessingResult[]> {
  return processImagesBatch(files, {
    ...processingOptions,
    concurrency,
  });
}

/**
 * Process images sequentially (one at a time)
 */
export async function processImagesSequential(
  files: File[],
  processingOptions: Omit<BatchProcessingOptions, 'concurrency' | 'onProgress' | 'onError'> = {},
  onProgress?: (completed: number, total: number, currentFile: string) => void
): Promise<ProcessingResult[]> {
  const results: ProcessingResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const result = await processImageEnhanced(file, processingOptions);
      results.push(result);
      onProgress?.(i + 1, files.length, file.name);
    } catch (error) {
      throw new Error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
}

/**
 * Create thumbnails for multiple images
 */
export async function createThumbnailsBatch(
  files: File[],
  size: number = 150,
  options: {
    concurrency?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpeg';
    onProgress?: (completed: number, total: number, currentFile: string) => void;
    onError?: (error: Error, file: File) => void;
  } = {}
): Promise<Array<{ file: File; thumbnail: Blob; error?: Error }>> {
  const { concurrency = 3, quality = 0.8, format = 'auto', onProgress, onError } = options;
  const results: Array<{ file: File; thumbnail: Blob; error?: Error }> = [];

  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    
    const batchPromises = batch.map(async (file, batchIndex) => {
      try {
        const result = await processImageEnhanced(file, {
          maxWidth: size,
          maxHeight: size,
          quality,
          format,
          preserveAspectRatio: true,
        });
        
        onProgress?.(i + batchIndex + 1, files.length, file.name);
        
        return { file, thumbnail: result.blob };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        onError?.(err, file);
        return { file, thumbnail: new Blob(), error: err };
      }
    });

    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        // This shouldn't happen since we catch errors above, but just in case
        results.push({ 
          file: batch[0], // Fallback file reference
          thumbnail: new Blob(), 
          error: new Error('Batch processing failed') 
        });
      }
    });
  }

  return results;
}

/**
 * Calculate total processing statistics for batch operations
 */
export function calculateBatchStats(results: ProcessingResult[]): {
  totalFiles: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  totalSizeSaved: number;
  averageCompressionRatio: number;
} {
  const totalFiles = results.length;
  // Calculate original size estimates from compressed size and ratio
  const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalOriginalSize = results.reduce((sum, r) => sum + (r.compressedSize / r.compressionRatio), 0);
  const totalSizeSaved = totalOriginalSize - totalCompressedSize;
  const averageCompressionRatio = results.reduce((sum, r) => sum + r.compressionRatio, 0) / totalFiles;

  return {
    totalFiles,
    totalOriginalSize,
    totalCompressedSize,
    totalSizeSaved,
    averageCompressionRatio,
  };
}

/**
 * Process images with retry logic
 */
export async function processImagesWithRetry(
  files: File[],
  processingOptions: Omit<BatchProcessingOptions, 'onProgress' | 'onError'> = {},
  maxRetries: number = 2,
  onProgress?: (completed: number, total: number, currentFile: string) => void,
  onError?: (error: Error, file: File, attempt: number) => void
): Promise<ProcessingResult[]> {
  const results: ProcessingResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let lastError: Error | null = null;
    let success = false;

    for (let attempt = 0; attempt <= maxRetries && !success; attempt++) {
      try {
        const result = await processImageEnhanced(file, processingOptions);
        results.push(result);
        success = true;
        onProgress?.(i + 1, files.length, file.name);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        onError?.(lastError, file, attempt + 1);
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    if (!success && lastError) {
      throw new Error(`Failed to process ${file.name} after ${maxRetries + 1} attempts: ${lastError.message}`);
    }
  }

  return results;
}
