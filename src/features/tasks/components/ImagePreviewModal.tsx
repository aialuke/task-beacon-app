import { X } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/shared/components/ui/button';
import ImageErrorFallback from '@/shared/components/ui/ImageErrorFallback';
import ImageLoadingState from '@/shared/components/ui/ImageLoadingState';

import { useImagePreview } from '../hooks/useImagePreview';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export const ImagePreviewModal = memo(function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  alt = 'Task attachment',
}: ImagePreviewModalProps) {
  const { imageLoaded, imageError, handleImageLoad, handleImageError } =
    useImagePreview();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/90 p-4"
      style={{
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
      }}
      onClick={handleBackdropClick}
    >
      {/* Close Button - Positioned absolutely in top-right */}
      <Button
        variant="default"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 size-10 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
        style={{ zIndex: 10000 }}
      >
        <X className="size-4" />
      </Button>

      {/* Modal Window */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
        </div>

        {/* Image Content */}
        <div className="relative flex min-h-[200px] items-center justify-center bg-gray-100 p-6">
          {!imageLoaded && !imageError && <ImageLoadingState />}
          {imageError && <ImageErrorFallback />}

          <img
            src={imageUrl}
            alt={alt}
            className={`max-h-[70vh] max-w-full object-contain shadow-lg transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </div>
    </div>
  );
});
