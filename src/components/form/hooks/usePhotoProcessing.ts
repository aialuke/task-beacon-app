
import { useCallback } from 'react';
import { compressAndResizePhoto } from '@/lib/utils/image/convenience';
import type { 
  ProcessingResult,
  EnhancedImageProcessingOptions 
} from '@/lib/utils/image/types';

/**
 * Simplified photo processing hook - Phase 2.4 Revised
 * Using standard React hooks instead of custom performance abstractions
 */
export function usePhotoProcessing(
  processingOptions: EnhancedImageProcessingOptions,
  photoState: {
    setPhoto: (file: File) => void;
    setPhotoPreview: (preview: string) => void;
    setLoading: (loading: boolean) => void;
    setProcessingResult: (result: ProcessingResult | null) => void;
  }
) {
  const { setPhoto, setPhotoPreview, setLoading, setProcessingResult } = photoState;

  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      try {
        const preview = URL.createObjectURL(file);
        setPhotoPreview(preview);

        const processedFile = await compressAndResizePhoto(
          file,
          processingOptions.maxWidth,
          processingOptions.maxHeight,
          processingOptions.quality
        );

        setPhoto(processedFile);
      } catch (error) {
        console.error('Photo processing error:', error);
      } finally {
        setLoading(false);
      }
    },
    [processingOptions, setPhoto, setPhotoPreview, setLoading]
  );

  return {
    handlePhotoChange,
  };
}
