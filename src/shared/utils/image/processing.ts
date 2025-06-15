
/**
 * Image Processing Utilities
 * Handles image compression, resizing, and format conversion
 */

import type { ImageProcessingOptions, ProcessedImageResult } from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<ImageProcessingOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  format: 'jpeg',
  maintainAspectRatio: true,
};

const SUPPORTED_FORMATS = ['jpeg', 'png', 'webp'] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ============================================================================
// MAIN PROCESSING FUNCTION
// ============================================================================

/**
 * Process an image file with compression and resizing
 */
export async function processImage(
  file: File,
  options: Partial<ImageProcessingOptions> = {}
): Promise<ProcessedImageResult> {
  try {
    // Validate input
    validateImageFile(file);
    
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    // Create image element
    const img = await createImageFromFile(file);
    
    // Calculate new dimensions
    const { width, height } = calculateDimensions(img, opts);
    
    // Create canvas and draw image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Use high-quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw and compress
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to blob
    const blob = await canvasToBlob(canvas, opts.format, opts.quality);
    
    // Create processed file
    const processedFile = new File(
      [blob],
      generateFileName(file.name, opts.format),
      { type: blob.type }
    );
    
    return {
      file: processedFile,
      originalSize: file.size,
      processedSize: processedFile.size,
      compressionRatio: file.size / processedFile.size,
      dimensions: { width, height },
      format: opts.format,
    };
    
  } catch (error) {
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate image file
 */
function validateImageFile(file: File): void {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (!file.type.startsWith('image/')) {
    throw new Error('File is not an image');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }
}

/**
 * Create image element from file
 */
function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Calculate target dimensions
 */
function calculateDimensions(
  img: HTMLImageElement,
  options: Required<ImageProcessingOptions>
): { width: number; height: number } {
  const { width: originalWidth, height: originalHeight } = img;
  const { maxWidth, maxHeight, maintainAspectRatio } = options;
  
  if (!maintainAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight),
    };
  }
  
  // Calculate scaling factor to maintain aspect ratio
  const widthRatio = maxWidth / originalWidth;
  const heightRatio = maxHeight / originalHeight;
  const scaleFactor = Math.min(widthRatio, heightRatio, 1);
  
  return {
    width: Math.round(originalWidth * scaleFactor),
    height: Math.round(originalHeight * scaleFactor),
  };
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = `image/${format}`;
    
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Generate processed file name
 */
function generateFileName(originalName: string, format: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const timestamp = Date.now();
  return `${nameWithoutExt}_processed_${timestamp}.${format}`;
}

// ============================================================================
// BATCH PROCESSING
// ============================================================================

/**
 * Process multiple images
 */
export async function processImages(
  files: File[],
  options: Partial<ImageProcessingOptions> = {}
): Promise<ProcessedImageResult[]> {
  const results: ProcessedImageResult[] = [];
  
  for (const file of files) {
    try {
      const result = await processImage(file, options);
      results.push(result);
    } catch (error) {
      // Continue processing other files even if one fails
      console.error(`Failed to process ${file.name}:`, error);
      results.push({
        file,
        originalSize: file.size,
        processedSize: file.size,
        compressionRatio: 1,
        dimensions: { width: 0, height: 0 },
        format: 'unknown',
        error: error instanceof Error ? error.message : 'Processing failed',
      });
    }
  }
  
  return results;
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export {
  DEFAULT_OPTIONS,
  SUPPORTED_FORMATS,
  MAX_FILE_SIZE,
};

export type {
  ImageProcessingOptions,
  ProcessedImageResult,
};
