
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent 
        className="max-w-4xl w-[90vw] h-[90vh] p-0 border-none bg-transparent shadow-none"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="relative h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ maxHeight: '85vh', maxWidth: '85vw' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});
