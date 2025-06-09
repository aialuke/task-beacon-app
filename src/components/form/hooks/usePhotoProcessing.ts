
import { useUnifiedPhotoUpload } from './useUnifiedPhotoUpload';
import type { EnhancedImageProcessingOptions } from '@/lib/utils/image/types';

/**
 * Photo processing hook - Phase 3 Deprecated
 * 
 * Use useUnifiedPhotoUpload instead. This is kept for backward compatibility.
 * @deprecated Use useUnifiedPhotoUpload instead
 */
export function usePhotoProcessing(
  processingOptions: EnhancedImageProcessingOptions,
  photoState: any
) {
  const unified = useUnifiedPhotoUpload({ processingOptions });

  return {
    handlePhotoChange: unified.handlePhotoChange,
  };
}
