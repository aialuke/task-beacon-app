
/**
 * Lazy Image Processing Loader
 * 
 * Dynamically imports image processing utilities only when needed
 * to reduce initial bundle size.
 */

// Lazy loading utilities for image processing
export const loadImageProcessing = async () => {
  const { processImageEnhanced, validateImageEnhanced } = await import('./index');
  return { processImageEnhanced, validateImageEnhanced };
};

export const loadImageMetadata = async () => {
  const { extractImageMetadataEnhanced, extractImageDimensions } = await import('./index');
  return { extractImageMetadataEnhanced, extractImageDimensions };
};

export const loadImageConvenience = async () => {
  const { 
    compressAndResizePhoto, 
    generateThumbnailEnhanced, 
    convertToWebPWithFallback 
  } = await import('./index');
  return { compressAndResizePhoto, generateThumbnailEnhanced, convertToWebPWithFallback };
};

export const loadImageResources = async () => {
  const { 
    createImagePreviewEnhanced, 
    cleanupObjectURLs, 
    ImagePreviewManager 
  } = await import('./index');
  return { createImagePreviewEnhanced, cleanupObjectURLs, ImagePreviewManager };
};

/**
 * Combined loader for all image utilities
 */
export const loadAllImageUtils = async () => {
  const [processing, metadata, convenience, resources] = await Promise.all([
    loadImageProcessing(),
    loadImageMetadata(),
    loadImageConvenience(),
    loadImageResources(),
  ]);
  
  return {
    ...processing,
    ...metadata,
    ...convenience,
    ...resources,
  };
};
