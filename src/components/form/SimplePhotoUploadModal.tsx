
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { SimplePhotoUpload } from './SimplePhotoUpload';
import type { ProcessingResult } from '@/lib/utils/image/types';

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

export function SimplePhotoUploadModal({
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
      <DialogContent className="max-w-sm">
        <div className="py-4">
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
