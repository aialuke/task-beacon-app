
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
    // Extract the correct extension from the file type
    let fileExt = 'jpg'; // Default fallback
    if (file.type === 'image/webp') {
      fileExt = 'webp';
    } else if (file.type === 'image/png') {
      fileExt = 'png';
    } else if (file.type === 'image/jpeg') {
      fileExt = 'jpg';
    } else {
      // Try to get extension from filename as fallback
      const nameExt = file.name.split('.').pop()?.toLowerCase();
      if (nameExt && ['jpg', 'jpeg', 'png', 'webp'].includes(nameExt)) {
        fileExt = nameExt === 'jpeg' ? 'jpg' : nameExt;
      }
    }

    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    return StorageService.uploadFile('task-photos', fileName, file);
  }

  /**
   * Delete a task photo
   */
  static async deletePhoto(photoUrl: string): Promise<ApiResponse<void>> {
    return apiRequest('tasks.deletePhoto', async () => {
      // Extract path from URL
      const urlParts = photoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const response = await StorageService.deleteFile('task-photos', fileName);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete photo');
      }
    });
  }
}
