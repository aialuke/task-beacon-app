/**
 * Image Conversion - Format Detection and Conversion
 *
 * Handles WebP detection, format optimization, and conversion logic.
 * Provides browser-aware format selection for optimal performance.
 */

// ConversionResult type moved to utils.ts with the convertToWebPWithFallback function

/**
 * WebP support detection and caching
 */
class WebPDetector {
  private static _supportsWebP: boolean | null = null;

  static async supportsWebP(): Promise<boolean> {
    if (this._supportsWebP !== null) {
      return this._supportsWebP;
    }

    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsWebP = webP.height === 2;
        resolve(this._supportsWebP);
      };
      webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }
}

/**
 * Get optimal format based on browser support
 */
export async function getOptimalImageFormat(
  file: File,
  forceFormat?: 'webp' | 'jpeg' | 'png',
): Promise<'webp' | 'jpeg' | 'png'> {
  if (forceFormat) {
    return forceFormat;
  }

  const webpSupport = await WebPDetector.supportsWebP();

  if (webpSupport) {
    return 'webp';
  }

  if (file.type === 'image/png') {
    return 'png'; // Preserve PNG for images that need transparency
  }

  return 'jpeg'; // Default fallback
}

// convertToWebPWithFallback moved to utils.ts to avoid circular dependency

// Export the detector for use in other modules
export { WebPDetector };
