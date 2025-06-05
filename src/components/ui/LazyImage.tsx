
import { useState, memo } from 'react';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    onLoad?.();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    setImageLoaded(false);
    onError?.(e);
  };

  // Use OptimizedImage for better performance
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      onLoad={handleImageLoad}
      onError={handleImageError}
      placeholder={!imageLoaded && !imageError ? (
        placeholder ? (
          <div className="absolute inset-0">{placeholder}</div>
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )
      ) : undefined}
    />
  );
});
