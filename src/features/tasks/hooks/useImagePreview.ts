import { useState } from 'react';

export function useImagePreview() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  // Inline image loading state logic
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  const resetImageState = () => {
    setImageLoaded(false);
    setImageError(false);
  };

  const openPreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImageUrl(null);
  };

  const resetState = () => {
    resetImageState();
    setIsPreviewOpen(false);
    setPreviewImageUrl(null);
  };

  return {
    imageLoaded,
    imageError,
    isPreviewOpen,
    previewImageUrl,
    handleImageLoad,
    handleImageError,
    openPreview,
    closePreview,
    resetState,
  };
}
