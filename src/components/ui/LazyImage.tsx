
import { memo } from 'react';

import { useImageLoadingState } from '@/hooks/core';
import { cn } from '@/lib/utils';

import { OptimizedImage } from './OptimizedImage';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  placeholder?: React.ReactNode;
  errorFallback?: React.ReactNode;
  priority?: boolean;
}

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  sizes,
  onLoad,
  onError,
  placeholder,
  errorFallback,
  priority = false,
}: LazyImageProps) {
  const { 
    imageLoaded, 
    imageError, 
    handleImageLoad: baseHandleImageLoad, 
    handleImageError: baseHandleImageError 
  } = useImageLoadingState();

  const handleImageLoad = () => {
    baseHandleImageLoad();
    onLoad?.();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    baseHandleImageError();
    onError?.(e);
  };

  // Create a default loading placeholder as a simple string for OptimizedImage
  const defaultPlaceholderText = 'Loading...';

  // Use OptimizedImage for better performance
  return (
    <div className={cn('relative', className)}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0">
          {placeholder ?? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}
        </div>
      )}
      
      {imageError && errorFallback && (
        <div className="absolute inset-0">{errorFallback}</div>
      )}

      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className="size-full object-cover"
        priority={priority}
        onLoad={handleImageLoad}
        onError={handleImageError}
        placeholder={defaultPlaceholderText}
      />
    </div>
  );
});
