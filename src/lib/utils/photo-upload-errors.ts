
/**
 * Photo Upload Error Utilities
 * 
 * Centralized error handling for photo upload operations.
 */

export interface PhotoUploadError {
  code: string;
  message: string;
  details?: unknown;
}

export const PhotoUploadErrorCodes = {
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
} as const;

export function createPhotoUploadError(
  code: keyof typeof PhotoUploadErrorCodes,
  message: string,
  details?: unknown
): PhotoUploadError {
  return { code, message, details };
}

export function getPhotoUploadErrorMessage(error: PhotoUploadError): string {
  switch (error.code) {
    case PhotoUploadErrorCodes.FILE_TOO_LARGE:
      return 'File size is too large. Please select a smaller image.';
    case PhotoUploadErrorCodes.INVALID_FILE_TYPE:
      return 'Invalid file type. Please select a JPG, PNG, or WebP image.';
    case PhotoUploadErrorCodes.PROCESSING_FAILED:
      return 'Failed to process image. Please try again.';
    case PhotoUploadErrorCodes.UPLOAD_FAILED:
      return 'Failed to upload image. Please check your connection and try again.';
    case PhotoUploadErrorCodes.NETWORK_ERROR:
      return 'Network error. Please check your connection and try again.';
    case PhotoUploadErrorCodes.VALIDATION_FAILED:
      return 'File validation failed. Please select a valid image file.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

export function isPhotoUploadError(error: unknown): error is PhotoUploadError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}
