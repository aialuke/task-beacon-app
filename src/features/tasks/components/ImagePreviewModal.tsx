
import { memo, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', imageUrl, e);
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4"
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
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg z-10"
        style={{ zIndex: 10000 }}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Modal Window */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-[90vw] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
        </div>
        
        {/* Image Content */}
        <div className="p-6 flex items-center justify-center bg-gray-100 relative min-h-[200px]">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600">Loading image...</span>
              </div>
            </div>
          )}
          
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-red-500 text-lg">Failed to load image</span>
                <p className="text-gray-500 text-sm mt-2">Please check your connection and try again</p>
              </div>
            </div>
          )}

          <img
            src={imageUrl}
            alt={alt}
            className={`max-w-full max-h-[70vh] object-contain shadow-lg transition-opacity duration-300 ${
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
