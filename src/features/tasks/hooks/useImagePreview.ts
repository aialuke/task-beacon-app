
import { useState } from 'react';

export function useImagePreview() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
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
    setImageLoaded(false);
    setImageError(false);
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
