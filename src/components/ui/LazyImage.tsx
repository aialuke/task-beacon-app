
import { useState, memo } from 'react';
import { cn } from '@/lib/utils';

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

  const defaultPlaceholder = (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const defaultErrorFallback = (
    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
      <span className="text-xs text-gray-500">Failed to load</span>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      {!imageLoaded && !imageError && (placeholder || defaultPlaceholder)}
      {imageError && (errorFallback || defaultErrorFallback)}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={cn(
          'transition-opacity duration-200',
          imageLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
});
