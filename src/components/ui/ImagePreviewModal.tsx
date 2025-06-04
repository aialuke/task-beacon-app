
import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';
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
  console.log('ImagePreviewModal - isOpen:', isOpen);
  console.log('ImagePreviewModal - imageUrl:', imageUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay 
        className="bg-black/80" 
        style={{ 
          zIndex: 999999,
          position: 'fixed',
          inset: 0,
        }} 
      />
      <DialogContent 
        className="max-w-[95vw] w-auto h-auto max-h-[95vh] p-0 border-none bg-transparent shadow-none overflow-hidden"
        style={{ 
          backgroundColor: 'transparent',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
          zIndex: 1000000,
          position: 'fixed',
        }}
      >
        <div className="relative flex items-center justify-center min-h-[200px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 border-none"
            style={{ zIndex: 1000001 }}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onLoad={() => console.log('ImagePreviewModal - Image loaded successfully')}
            onError={(e) => console.error('ImagePreviewModal - Image failed to load:', e)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});
