import { useCallback } from 'react';
import { TaskService } from '@/lib/api/tasks/task.service';

/**
 * Hook for handling photo upload during task creation
 */
export function useCreateTaskPhotoUpload() {
  const uploadPhotoIfPresent = useCallback(
    async (photo: File | null): Promise<string | null> => {
      if (!photo) {
        console.log('useCreateTaskPhotoUpload.uploadPhotoIfPresent - No photo to upload');
        return null;
      }

      try {
        console.log('useCreateTaskPhotoUpload.uploadPhotoIfPresent - Starting upload for:', photo.name);
        
        const response = await TaskService.uploadPhoto(photo);
        
        if (!response.success) {
          console.error('useCreateTaskPhotoUpload.uploadPhotoIfPresent - Upload failed:', response.error);
          throw new Error(response.error?.message || 'Photo upload failed');
        }
        
        console.log('useCreateTaskPhotoUpload.uploadPhotoIfPresent - Upload successful:', response.data);
        return response.data || null;
      } catch (error: unknown) {
        console.error('useCreateTaskPhotoUpload.uploadPhotoIfPresent - Error during upload:', error);
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
