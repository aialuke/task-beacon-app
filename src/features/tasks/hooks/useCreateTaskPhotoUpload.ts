
import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';

/**
 * Hook for handling photo upload during task creation - Phase 3 Simplified
 * 
 * Now uses the unified photo upload system
 */
export function useCreateTaskPhotoUpload() {
  const { uploadPhoto } = useUnifiedPhotoUpload();

  return {
    uploadPhotoIfPresent: async (photo: File | null): Promise<string | null> => {
      if (!photo) {
        return null;
      }

      try {
        return await uploadPhoto(photo);
      } catch (error: unknown) {
        console.error('Error during photo upload:', error);
        // Return null instead of throwing to allow task creation without photo
        return null;
      }
    },
  };
}
