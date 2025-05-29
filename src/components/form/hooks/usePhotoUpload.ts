import { useState, useCallback } from 'react';
import { toast } from '@/lib/toast';
import { compressAndResizePhoto } from '@/lib/imageUtils';
import { uploadTaskPhoto } from '@/integrations/supabase/api/tasks.api';

/**
 * Hook for managing photo upload functionality
 */
export function usePhotoUpload() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles photo file input changes
   */
  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) {
        setLoading(false);
        return;
      }

      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      try {
        const processedFile = await compressAndResizePhoto(file);
        setPhoto(processedFile);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Uploads the selected photo
   */
  const uploadPhoto = useCallback(async (): Promise<string | null> => {
    if (!photo) return null;

    try {
      const { data: photoUrl, error } = await uploadTaskPhoto(photo);
      if (error) throw error;
      return photoUrl || null;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  }, [photo]);

  const resetPhoto = useCallback(() => {
    setPhoto(null);
    setPhotoPreview(null);
  }, []);

  return {
    photo,
    photoPreview,
    loading,
    handlePhotoChange,
    uploadPhoto,
    resetPhoto,
  };
}
