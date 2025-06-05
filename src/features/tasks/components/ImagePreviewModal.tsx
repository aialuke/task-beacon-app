
import { memo } from 'react';
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
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
        <div className="p-6 flex items-center justify-center bg-gray-100">
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-[70vh] object-contain shadow-lg"
            onError={(e) => console.error('Image failed to load:', e)}
          />
        </div>
      </div>
    </div>
  );
});
