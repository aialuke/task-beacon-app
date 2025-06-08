/**
 * Resource Management Utilities
 * 
 * URL management, cleanup, and resource handling for image processing.
 * This module provides utilities for managing browser resources and object URLs.
 */

import { logger } from '../../logger';
import type { ImagePreview } from './types';

/**
 * Create image preview URL with enhanced cleanup
 */
export function createImagePreviewEnhanced(
  file: File,
  autoRevoke = true,
  revokeDelay: number = 5 * 60 * 1000 // 5 minutes
): ImagePreview {
  const url = URL.createObjectURL(file);
  let revoked = false;
  
  const revoke = () => {
    if (!revoked) {
      URL.revokeObjectURL(url);
      revoked = true;
    }
  };

  const isRevoked = () => revoked;

  if (autoRevoke) {
    setTimeout(revoke, revokeDelay);
  }

  return { url, revoke, isRevoked };
}

/**
 * Cleanup utility for multiple object URLs
 */
export function cleanupObjectURLs(urls: string[]): void {
  urls.forEach(url => {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.warn('Failed to revoke object URL', { url, error });
    }
  });
}

/**
 * Create and manage multiple preview URLs
 */
export function createImagePreviews(
  files: File[],
  autoRevoke: boolean = true,
  revokeDelay: number = 5 * 60 * 1000
): { file: File; preview: ImagePreview }[] {
  return files.map(file => ({
    file,
    preview: createImagePreviewEnhanced(file, autoRevoke, revokeDelay),
  }));
}

/**
 * Cleanup all previews at once
 */
export function cleanupImagePreviews(previews: { file: File; preview: ImagePreview }[]): void {
  previews.forEach(({ preview }) => {
    preview.revoke();
  });
}

/**
 * Create a managed preview with automatic cleanup
 */
export function createManagedPreview(file: File): {
  url: string;
  cleanup: () => void;
  isCleanedUp: () => boolean;
} {
  const preview = createImagePreviewEnhanced(file, false); // Don't auto-revoke
  
  return {
    url: preview.url,
    cleanup: preview.revoke,
    isCleanedUp: preview.isRevoked,
  };
}

/**
 * Download processed image as file
 */
export function downloadImage(
  blob: Blob,
  filename = 'processed-image.jpg'
): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup after a short delay to ensure download starts
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Download multiple images as individual files
 */
export function downloadImages(
  results: { blob: Blob; filename: string }[]
): void {
  results.forEach(({ blob, filename }, index) => {
    // Add small delay between downloads to avoid browser blocking
    setTimeout(() => {
      downloadImage(blob, filename);
    }, index * 100);
  });
}

/**
 * Convert blob to data URL for inline use
 */
export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => { resolve(reader.result as string); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Copy image to clipboard (modern browsers)
 */
export async function copyImageToClipboard(blob: Blob): Promise<void> {
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error('Clipboard API not supported');
  }

  try {
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
  } catch (error) {
    throw new Error(`Failed to copy image to clipboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Memory-efficient preview manager for large numbers of images
 */
export class ImagePreviewManager {
  private previews = new Map<string, ImagePreview>();
  private maxPreviews: number;

  constructor(maxPreviews = 50) {
    this.maxPreviews = maxPreviews;
  }

  /**
   * Create or get existing preview
   */
  getPreview(file: File, autoRevoke = true): ImagePreview {
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    
    if (this.previews.has(key)) {
      return this.previews.get(key)!;
    }

    // Clean up oldest previews if we're at the limit
    if (this.previews.size >= this.maxPreviews) {
      const oldestKey = this.previews.keys().next().value;
      const oldestPreview = this.previews.get(oldestKey);
      if (oldestPreview) {
        oldestPreview.revoke();
        this.previews.delete(oldestKey);
      }
    }

    const preview = createImagePreviewEnhanced(file, autoRevoke);
    this.previews.set(key, preview);
    
    return preview;
  }

  /**
   * Remove specific preview
   */
  removePreview(file: File): void {
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    const preview = this.previews.get(key);
    
    if (preview) {
      preview.revoke();
      this.previews.delete(key);
    }
  }

  /**
   * Clean up all previews
   */
  cleanup(): void {
    this.previews.forEach(preview => { preview.revoke(); });
    this.previews.clear();
  }

  /**
   * Get current number of active previews
   */
  getActiveCount(): number {
    return this.previews.size;
  }
} // CodeRabbit review
