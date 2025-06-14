import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { ProcessingResult } from '@/lib/utils/image/';

import SimplePhotoUpload from './SimplePhotoUpload';

interface SimplePhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove?: () => void;
  onSubmit?: () => void;
  processingResult?: ProcessingResult | null;
  loading?: boolean;
  title?: string;
}

export default function SimplePhotoUploadModal({
  isOpen,
  onClose,
  photoPreview,
  onPhotoChange,
  onPhotoRemove,
  onSubmit,
  processingResult,
  loading = false,
}: SimplePhotoUploadModalProps) {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs py-4">
        <VisuallyHidden>
          <DialogTitle>Upload Photo</DialogTitle>
        </VisuallyHidden>
        <div className="py-2">
          <SimplePhotoUpload
            photoPreview={photoPreview}
            onPhotoChange={onPhotoChange}
            onPhotoRemove={onPhotoRemove}
            onSubmit={handleSubmit}
            processingResult={processingResult}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Note: Named export SimplePhotoUploadModal removed as unused
