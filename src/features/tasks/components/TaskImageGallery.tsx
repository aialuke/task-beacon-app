
import { memo, useState } from 'react';
import { ImagePreviewModal } from './ImagePreviewModal';

interface TaskImageGalleryProps {
  photoUrl: string;
  alt?: string;
}

function TaskImageGallery({ photoUrl, alt = 'Task attachment' }: TaskImageGalleryProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <>
      <div>
        <span className="text-sm font-medium text-muted-foreground">
          Photo:
        </span>
        <button
          onClick={handleImageClick}
          className="mt-1 block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-xl"
          title="Click to view full size"
        >
          <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-100">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-xs text-gray-500">Failed to load</span>
              </div>
            )}
            <img
              src={photoUrl}
              alt={alt}
              className={`h-full w-full object-cover cursor-pointer transition-opacity duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              sizes="80px"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </button>
      </div>

      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={handleImageModalClose}
        imageUrl={photoUrl}
        alt={alt}
      />
    </>
  );
}

export default memo(TaskImageGallery);
