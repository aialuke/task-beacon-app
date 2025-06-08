
/**
 * Image Preview Management
 * 
 * URL creation and preview management for image processing.
 */

import { logger } from '../../../logger';
import type { ImagePreview } from '../types';

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
}
