import type { ProcessingResult } from '@/lib/utils/image/';

export interface SimplePhotoUploadProps {
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove?: (() => void) | undefined;
  onSubmit?: (() => void) | undefined;
  processingResult?: ProcessingResult | null | undefined;
  loading?: boolean;
}
