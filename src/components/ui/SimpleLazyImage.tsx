
/**
 * Simplified Lazy Image Component - Phase 2 Complexity Reduction
 * 
 * State machine pattern for cleaner state management.
 */

import { memo, useReducer, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageSkeleton } from './loading/UnifiedLoadingStates';

type ImageState = 
  | { type: 'loading' }
  | { type: 'loaded' }
  | { type: 'error'; message: string };

type ImageAction = 
  | { type: 'LOAD' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; message: string };

function imageReducer(state: ImageState, action: ImageAction): ImageState {
  switch (action.type) {
    case 'LOAD':
      return { type: 'loading' };
    case 'SUCCESS':
      return { type: 'loaded' };
    case 'ERROR':
      return { type: 'error', message: action.message };
    default:
      return state;
  }
}

interface SimpleLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallbackMessage?: string;
}

const SimpleLazyImage = memo(function SimpleLazyImage({
  src,
  alt,
  className,
  aspectRatio = 'aspect-video',
  fallbackMessage = 'Failed to load image',
}: SimpleLazyImageProps) {
  const [state, dispatch] = useReducer(imageReducer, { type: 'loading' });

  useEffect(() => {
    dispatch({ type: 'LOAD' });
    
    const img = new Image();
    img.onload = () => dispatch({ type: 'SUCCESS' });
    img.onerror = () => dispatch({ type: 'ERROR', message: fallbackMessage });
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackMessage]);

  const handleImageLoad = () => {
    dispatch({ type: 'SUCCESS' });
  };

  const handleImageError = () => {
    dispatch({ type: 'ERROR', message: fallbackMessage });
  };

  return (
    <div className={cn("relative", aspectRatio, className)}>
      {state.type === 'loading' && (
        <ImageSkeleton aspectRatio={aspectRatio} className="absolute inset-0" />
      )}
      
      {state.type === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center p-4">
            <div className="text-destructive mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">{state.message}</p>
          </div>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover rounded-lg transition-opacity duration-300",
          state.type === 'loaded' ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
});

export default SimpleLazyImage;
