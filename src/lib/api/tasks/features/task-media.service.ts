/**
 * Task Media Service - Handles photo upload and deletion operations
 */

import { apiRequest } from '../../error-handling';
import { StorageService } from '../../storage.service';
import type { ApiResponse } from '@/types';

export class TaskMediaService {
  /**
   * Upload a photo for a task
   */
  static async uploadPhoto(file: File): Promise<ApiResponse<string>> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `task-photos/${fileName}`;

    return StorageService.uploadFile('task-photos', filePath, file);
  }

  /**
   * Delete a task photo
   */
  static async deletePhoto(photoUrl: string): Promise<ApiResponse<void>> {
    return apiRequest('tasks.deletePhoto', async () => {
      // Extract path from URL
      const urlParts = photoUrl.split('/');
      const bucket = urlParts[urlParts.length - 2];
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `task-photos/${fileName}`;

      const response = await StorageService.deleteFile(bucket, filePath);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete photo');
      }
    });
  }
} 