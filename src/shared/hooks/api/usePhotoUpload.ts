import { useMutation } from '@tanstack/react-query';

import { TaskService } from '@/shared/services/api';

import {
  handleDataAccessError,
  handleDataAccessSuccess,
  ErrorPatterns,
} from './useErrorHandling';

export interface PhotoUploadResult {
  success: boolean;
  url?: string | null;
  error?: string;
}

/**
 * Photo Upload Hook - Service Abstraction Layer
 *
 * Abstracts TaskService.media.uploadPhoto with consistent error handling,
 * user feedback, and loading states. Eliminates direct service imports in components.
 */
export function usePhotoUpload() {
  const mutation = useMutation({
    mutationFn: async (file: File): Promise<string | null> => {
      const response = await TaskService.media.uploadPhoto(file);
      if (!response.success) {
        throw new Error(response.error?.message || 'Photo upload failed');
      }
      return response.data || null;
    },
    onError: (error: Error) => {
      handleDataAccessError(error, { operation: ErrorPatterns.UPLOAD_FAILED });
    },
    onSuccess: (url: string | null) => {
      if (url) {
        handleDataAccessSuccess('photo upload');
      }
    },
  });

  const uploadPhoto = async (file: File): Promise<PhotoUploadResult> => {
    try {
      const url = await mutation.mutateAsync(file);
      return {
        success: true,
        url,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  return {
    uploadPhoto,
    isUploading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}
