
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

  // Create a default loading placeholder as a simple string for OptimizedImage
  const defaultPlaceholderText = 'Loading...';

  // Use OptimizedImage for better performance
  return (
    <div className={cn('relative', className)}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0">
          {placeholder || (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
        className="w-full h-full object-cover"
        priority={priority}
        onLoad={handleImageLoad}
        onError={handleImageError}
        placeholder={defaultPlaceholderText}
      />
    </div>
  );
});
