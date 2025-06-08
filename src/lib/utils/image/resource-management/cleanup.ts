
/**
 * Resource Cleanup and Download Utilities
 * 
 * File download, clipboard operations, and URL cleanup functions.
 */

import { logger } from '../../../logger';

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
