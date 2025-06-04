
/**
 * Photo Validation Utilities
 * 
 * Centralized validation for photo uploads with proper error handling.
 */

import { PhotoUploadErrorCodes, createPhotoUploadError } from './photo-upload-errors';

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DIMENSION = 4096; // 4K max width/height

export interface FileValidationResult {
  valid: boolean;
  error?: ReturnType<typeof createPhotoUploadError>;
}

export interface FileDimensions {
  width: number;
  height: number;
}

/**
 * Validate file type and size before processing
 */
export function validatePhotoFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: createPhotoUploadError(
        PhotoUploadErrorCodes.FILE_TOO_LARGE,
        `File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
        { fileSize: file.size, maxSize: MAX_FILE_SIZE }
      )
    };
  }

  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: createPhotoUploadError(
        PhotoUploadErrorCodes.INVALID_FILE_TYPE,
        `File type ${file.type} is not supported. Please use JPG, PNG, WebP, or GIF.`,
        { fileType: file.type, supportedTypes: SUPPORTED_IMAGE_TYPES }
      )
    };
  }

  return { valid: true };
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<FileDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(createPhotoUploadError(
        PhotoUploadErrorCodes.VALIDATION_FAILED,
        'Failed to load image for dimension validation'
      ));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(dimensions: FileDimensions): FileValidationResult {
  if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
    return {
      valid: false,
      error: createPhotoUploadError(
        PhotoUploadErrorCodes.FILE_TOO_LARGE,
        `Image dimensions (${dimensions.width}x${dimensions.height}) exceed maximum allowed size (${MAX_DIMENSION}x${MAX_DIMENSION})`,
        { dimensions, maxDimension: MAX_DIMENSION }
      )
    };
  }

  return { valid: true };
}
