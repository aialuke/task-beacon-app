import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SimplePhotoUpload } from './SimplePhotoUpload';
import type { ProcessingResult } from '@/lib/utils/image/types';
interface SimplePhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove?: () => void;
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
  processingResult,
  loading = false,
  title = "Upload Image"
}: SimplePhotoUploadModalProps) {
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          
        </DialogHeader>

        <div className="py-4">
          <SimplePhotoUpload photoPreview={photoPreview} onPhotoChange={onPhotoChange} onPhotoRemove={onPhotoRemove} processingResult={processingResult} loading={loading} />
        </div>
      </DialogContent>
    </Dialog>;
}