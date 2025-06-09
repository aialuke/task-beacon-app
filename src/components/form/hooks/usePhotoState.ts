
import { useUnifiedPhotoUpload } from './useUnifiedPhotoUpload';

/**
 * Photo state management hook - Phase 3 Deprecated
 * 
 * Use useUnifiedPhotoUpload instead. This is kept for backward compatibility.
 * @deprecated Use useUnifiedPhotoUpload instead
 */
export function usePhotoState() {
  const unified = useUnifiedPhotoUpload();
  
  return {
    photo: unified.photo,
    setPhoto: () => {}, // No-op for compatibility
    photoPreview: unified.photoPreview,
    setPhotoPreview: () => {}, // No-op for compatibility
    loading: unified.loading,
    setLoading: () => {}, // No-op for compatibility
    processingResult: unified.processingResult,
    setProcessingResult: () => {}, // No-op for compatibility
    resetPhoto: unified.resetPhoto,
  };
}
