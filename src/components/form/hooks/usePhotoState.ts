
import { useState } from 'react';
import { useOptimizedCallback } from '@/hooks/performance';
import type { ProcessingResult } from '@/lib/utils/image/types';

/**
 * Core photo state management hook - Phase 2.3 Hook Standardization
 * 
 * Focused hook for managing photo upload state
 */
export function usePhotoState() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);

  const resetPhoto = useOptimizedCallback(() => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview(null);
    setProcessingResult(null);
  }, [photoPreview], { name: 'resetPhoto' });

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
