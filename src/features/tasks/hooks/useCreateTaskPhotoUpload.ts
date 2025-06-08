
import { useCallback } from 'react';
import { TaskService } from '@/lib/api/tasks/task.service';

/**
 * Hook for handling photo upload during task creation
 */
export function useCreateTaskPhotoUpload() {
  const uploadPhotoIfPresent = useCallback(
    async (photo: File | null): Promise<string | null> => {
      if (!photo) {
        return null;
      }

      try {
        const response = await TaskService.media.uploadPhoto(photo);
        
        if (!response.success) {
          console.error('Photo upload failed:', response.error);
          throw new Error(response.error?.message || 'Photo upload failed');
        }
        
        return response.data || null;
      } catch (error: unknown) {
        console.error('Error during photo upload:', error);
        // Return null instead of throwing to allow task creation without photo
        return null;
      }
    },
    []
  );

  return {
    uploadPhotoIfPresent,
  };
}
// CodeRabbit review
