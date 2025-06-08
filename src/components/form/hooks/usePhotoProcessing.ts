
import { useOptimizedCallback } from '@/hooks/performance';
import { compressAndResizePhoto } from '@/lib/utils/image/convenience';
import type { 
  ProcessingResult,
  EnhancedImageProcessingOptions 
} from '@/lib/utils/image/types';

/**
 * Photo processing hook - Phase 2.3 Hook Standardization
 * 
 * Focused hook for handling photo file processing
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

  const handlePhotoChange = useOptimizedCallback(
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
    [processingOptions, setPhoto, setPhotoPreview, setLoading],
    { name: 'handlePhotoChange' }
  );

  return {
    handlePhotoChange,
  };
}
