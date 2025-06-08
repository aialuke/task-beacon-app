
/**
 * Lazy Image Processing Loader
 * 
 * Dynamically imports image processing utilities only when needed
 * to reduce initial bundle size.
 */

// Lazy loading utilities for image processing
export const loadImageProcessing = async () => {
  const module = await import('./index');
  return { 
    processImageEnhanced: module.processImageEnhanced, 
    validateImageEnhanced: module.validateImageEnhanced 
  };
};

export const loadImageMetadata = async () => {
  const module = await import('./index');
  return { 
    extractImageMetadataEnhanced: module.extractImageMetadataEnhanced, 
    extractImageDimensions: module.extractImageDimensions 
  };
};

export const loadImageConvenience = async () => {
  const module = await import('./index');
  return { 
    compressAndResizePhoto: module.compressAndResizePhoto, 
    generateThumbnailEnhanced: module.generateThumbnailEnhanced, 
    convertToWebPWithFallback: module.convertToWebPWithFallback 
  };
};

export const loadImageResources = async () => {
  const module = await import('./index');
  return { 
    createImagePreviewEnhanced: module.createImagePreviewEnhanced, 
    cleanupObjectURLs: module.cleanupObjectURLs, 
    ImagePreviewManager: module.ImagePreviewManager 
  };
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
