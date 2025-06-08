
import { useState, useCallback } from 'react';
import type { ProcessingResult } from '@/lib/utils/image/types';

/**
 * Simplified photo state management hook - Phase 2.4 Revised
 * Using standard React hooks instead of custom performance abstractions
 */
export function usePhotoState() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);

  const resetPhoto = useCallback(() => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview(null);
    setProcessingResult(null);
  }, [photoPreview]);

  return {
    photo,
    setPhoto,
    photoPreview,
    setPhotoPreview,
    loading,
    setLoading,
    processingResult,
    setProcessingResult,
    resetPhoto,
  };
}
