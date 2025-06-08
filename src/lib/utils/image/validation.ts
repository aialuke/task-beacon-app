/**
 * Image Validation Utilities
 * 
 * Comprehensive image validation with detailed feedback and error reporting.
 * This module provides robust validation for file uploads and image processing.
 */

import { logger } from '../../logger';
import { formatFileSize } from '../shared';
import type { EnhancedImageValidationOptions, ValidationResult } from './types';
import { DEFAULT_ENHANCED_VALIDATION } from './constants';
import { extractImageMetadataEnhanced } from './metadata';

/**
 * Enhanced image validation with detailed feedback
 */
export async function validateImageEnhanced(
  file: File,
  options: EnhancedImageValidationOptions = {}
): Promise<ValidationResult> {
  const opts = { ...DEFAULT_ENHANCED_VALIDATION, ...options };
  const warnings: string[] = [];
  
  try {
    // Basic file checks
    if (!file || !(file instanceof File)) {
      return {
        valid: false,
        error: 'Invalid file object provided',
      };
    }

    // File size validation
    if (file.size > opts.maxSize) {
      return {
        valid: false,
        error: `File size ${formatFileSize(file.size)} exceeds maximum allowed size ${formatFileSize(opts.maxSize)}`,
        details: {
          fileSize: formatFileSize(file.size),
          dimensions: 'Unknown',
          type: file.type,
          aspectRatio: 0,
        },
      };
    }

    if (file.size < opts.minSize) {
      return {
        valid: false,
        error: `File size ${formatFileSize(file.size)} is below minimum required size ${formatFileSize(opts.minSize)}`,
      };
    }

    // File type validation
    if (!opts.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type "${file.type}" is not allowed. Supported types: ${opts.allowedTypes.join(', ')}`,
      };
    }

    // Get image metadata for dimension validation
    const metadata = await extractImageMetadataEnhanced(file);
    
    // Dimension validation
    if (metadata.width > opts.maxWidth || metadata.height > opts.maxHeight) {
      return {
        valid: false,
        error: `Image dimensions ${metadata.width}×${metadata.height} exceed maximum allowed ${opts.maxWidth}×${opts.maxHeight}`,
        details: {
          fileSize: formatFileSize(file.size),
          dimensions: `${metadata.width}×${metadata.height}`,
          type: file.type,
          aspectRatio: metadata.aspectRatio,
        },
      };
    }

    if (metadata.width < opts.minWidth || metadata.height < opts.minHeight) {
      return {
        valid: false,
        error: `Image dimensions ${metadata.width}×${metadata.height} are below minimum required ${opts.minWidth}×${opts.minHeight}`,
      };
    }

    // Aspect ratio validation
    const aspectRatioValid = opts.allowedAspectRatios.some(
      ratio => metadata.aspectRatio >= ratio.min && metadata.aspectRatio <= ratio.max
    );

    if (!aspectRatioValid) {
      const ratioRanges = opts.allowedAspectRatios
        .map(r => `${r.min.toFixed(2)}-${r.max.toFixed(2)}`)
        .join(', ');
      
      return {
        valid: false,
        error: `Image aspect ratio ${metadata.aspectRatio.toFixed(2)} is not within allowed ranges: ${ratioRanges}`,
      };
    }

    // Add warnings for common issues
    if (metadata.megapixels > 12) {
      warnings.push(`High resolution image (${metadata.megapixels.toFixed(1)}MP) may take longer to process`);
    }

    if (file.size > 2 * 1024 * 1024) {
      warnings.push(`Large file size (${formatFileSize(file.size)}) - compression recommended`);
    }

    return {
      valid: true,
      warnings: warnings.length > 0 ? warnings : undefined,
      details: {
        fileSize: formatFileSize(file.size),
        dimensions: `${metadata.width}×${metadata.height}`,
        type: file.type,
        aspectRatio: metadata.aspectRatio,
      },
    };

  } catch (error) {
    logger.error('Error validating image:', error);
    return {
      valid: false,
      error: 'Failed to validate image file',
    };
  }
}

/**
 * Quick validation that only checks file properties (no metadata extraction)
 */
export function validateImageQuick(
  file: File,
  options: Pick<EnhancedImageValidationOptions, 'maxSize' | 'minSize' | 'allowedTypes'> = {}
): ValidationResult {
  const opts = {
    maxSize: options.maxSize ?? DEFAULT_ENHANCED_VALIDATION.maxSize,
    minSize: options.minSize ?? DEFAULT_ENHANCED_VALIDATION.minSize,
    allowedTypes: options.allowedTypes ?? DEFAULT_ENHANCED_VALIDATION.allowedTypes,
  };

  // Basic file checks
  if (!file || !(file instanceof File)) {
    return {
      valid: false,
      error: 'Invalid file object provided',
    };
  }

  // File size validation
  if (file.size > opts.maxSize) {
    return {
      valid: false,
      error: `File size ${formatFileSize(file.size)} exceeds maximum allowed size ${formatFileSize(opts.maxSize)}`,
    };
  }

  if (file.size < opts.minSize) {
    return {
      valid: false,
      error: `File size ${formatFileSize(file.size)} is below minimum required size ${formatFileSize(opts.minSize)}`,
    };
  }

  // File type validation
  if (!opts.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed. Supported types: ${opts.allowedTypes.join(', ')}`,
    };
  }

  return {
    valid: true,
    details: {
      fileSize: formatFileSize(file.size),
      dimensions: 'Not checked',
      type: file.type,
      aspectRatio: 0,
    },
  };
}

/**
 * Validate multiple files at once
 */
export async function validateImagesEnhanced(
  files: File[],
  options: EnhancedImageValidationOptions = {}
): Promise<ValidationResult[]> {
  return Promise.all(
    files.map(file => validateImageEnhanced(file, options))
  );
}

/**
 * Check if all validation results are valid
 */
export function areAllValidationResultsValid(results: ValidationResult[]): boolean {
  return results.every(result => result.valid);
}

/**
 * Get all validation errors from results
 */
export function getValidationErrors(results: ValidationResult[]): string[] {
  return results
    .filter(result => !result.valid && result.error)
    .map(result => result.error!);
}

/**
 * Get all validation warnings from results
 */
export function getValidationWarnings(results: ValidationResult[]): string[] {
  return results
    .filter(result => result.warnings && result.warnings.length > 0)
    .flatMap(result => result.warnings!);
} // CodeRabbit review
