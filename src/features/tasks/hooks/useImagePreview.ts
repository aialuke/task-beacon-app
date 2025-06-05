
import { useState } from 'react';

export function useImagePreview() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const resetState = () => {
    setImageLoaded(false);
    setImageError(false);
  };

  return {
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError,
    resetState,
  };
}
