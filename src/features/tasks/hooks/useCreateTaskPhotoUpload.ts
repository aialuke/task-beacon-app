import { useCallback } from 'react';
import { uploadTaskPhoto } from '@/integrations/supabase/api/tasks.api';

/**
 * Hook for handling photo upload during task creation
 */
export function useCreateTaskPhotoUpload() {
  const uploadPhotoIfPresent = useCallback(
    async (photo: File | null): Promise<string | null> => {
      if (!photo) return null;

      try {
        const { data: uploadedUrl, error: uploadError } =
          await uploadTaskPhoto(photo);
        if (uploadError) throw uploadError;
        return uploadedUrl;
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
    },
    []
  );

  return {
    uploadPhotoIfPresent,
  };
}
