/**
 * Image Utilities Constants and Configuration
 * 
 * Default values, configuration options, and test data for the image utilities system.
 * This module centralizes all configuration to make it easy to modify defaults.
 */

import type { EnhancedImageValidationOptions, EnhancedImageProcessingOptions } from './types';

/**
 * Default enhanced validation rules
 */
export const DEFAULT_ENHANCED_VALIDATION: Required<EnhancedImageValidationOptions> = {
  maxSize: 10 * 1024 * 1024, // 10MB
  minSize: 1024, // 1KB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  maxWidth: 8192,
  maxHeight: 8192,
  minWidth: 32,
  minHeight: 32,
  allowedAspectRatios: [
    { min: 0.1, max: 10.0 } // Very permissive by default
  ],
};

/**
 * Default processing options
 */
export const DEFAULT_PROCESSING_OPTIONS: Required<EnhancedImageProcessingOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'auto',
  preserveAspectRatio: true,
  enableSmoothing: true,
  generateThumbnail: false,
  thumbnailSize: 150,
};

/**
 * WebP test images for feature detection
 */
export const WEBP_TEST_IMAGES = {
  // Basic WebP support test
  basic: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
  
  // Lossless WebP support test
  lossless: 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=',
  
  // Alpha channel WebP support test
  alpha: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
  
  // Animation WebP support test
  animation: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
} as const;

/**
 * Common image MIME types
 */
export const IMAGE_MIME_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  GIF: 'image/gif',
  AVIF: 'image/avif',
  BMP: 'image/bmp',
  TIFF: 'image/tiff',
} as const;

/**
 * File size constants
 */
export const FILE_SIZE = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

/**
 * Common dimension presets
 */
export const DIMENSION_PRESETS = {
  THUMBNAIL: { width: 150, height: 150 },
  SMALL: { width: 300, height: 300 },
  MEDIUM: { width: 600, height: 600 },
  LARGE: { width: 1200, height: 1200 },
  HD: { width: 1920, height: 1080 },
  '4K': { width: 3840, height: 2160 },
} as const;

/**
 * Quality presets for different use cases
 */
export const QUALITY_PRESETS = {
  LOW: 0.6,
  MEDIUM: 0.8,
  HIGH: 0.9,
  MAXIMUM: 0.95,
} as const; // CodeRabbit review
// CodeRabbit review
