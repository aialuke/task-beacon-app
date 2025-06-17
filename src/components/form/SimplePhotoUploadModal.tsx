
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import SimplePhotoUpload from './SimplePhotoUpload';
import type { SimplePhotoUploadProps } from './SimplePhotoUploadTypes';

interface SimplePhotoUploadModalProps extends SimplePhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
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

  // Create props object with proper undefined handling
  const photoUploadProps: SimplePhotoUploadProps = {
    photoPreview,
    onPhotoChange,
    onSubmit: handleSubmit,
    loading,
    ...(onPhotoRemove !== undefined && { onPhotoRemove }),
    ...(processingResult !== undefined && { processingResult }),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs py-4">
        <VisuallyHidden>
          <DialogTitle>Upload Photo</DialogTitle>
        </VisuallyHidden>
        <div className="py-2">
          <SimplePhotoUpload {...photoUploadProps} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Note: Named export SimplePhotoUploadModal removed as unused
