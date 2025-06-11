import { useState } from 'react';

import { useImageLoadingState } from '@/hooks/core';

export function useImagePreview() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const {
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError,
    resetImageState,
  } = useImageLoadingState();

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
