import { useCallback } from 'react';
import { TaskService } from '@/lib/api/tasks/task.service';

/**
 * Hook for handling photo upload during task creation
 */
export function useCreateTaskPhotoUpload() {
  const uploadPhotoIfPresent = useCallback(
    async (photo: File | null): Promise<string | null> => {
      if (!photo) return null;

      try {
        const response = await TaskService.uploadPhoto(photo);
        if (!response.success) {
          throw new Error(response.error?.message || 'Photo upload failed');
        }
        return response.data || null;
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
