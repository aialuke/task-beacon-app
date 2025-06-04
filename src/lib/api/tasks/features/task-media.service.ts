
/**
 * Task Media Service - Handles photo upload and deletion operations
 * 
 * Enhanced with bucket validation, consistent error handling, and improved logging.
 */

import { apiRequest } from '../../error-handling';
import { StorageService } from '../../storage.service';
import { validatePhotoFile } from '@/lib/utils/photo-validation';
import { createPhotoUploadError, PhotoUploadErrorCodes } from '@/lib/utils/photo-upload-errors';
import type { ApiResponse } from '@/types';

export class TaskMediaService {
  private static readonly BUCKET_NAME = 'task-photos';

  /**
   * Validate that the storage bucket exists and is accessible
   */
  private static async validateBucket(): Promise<void> {
    try {
      // Simple bucket validation by attempting to get public URL
      const testUrl = StorageService.getPublicUrl(this.BUCKET_NAME, 'test');
      if (!testUrl) {
        throw new Error(`Storage bucket '${this.BUCKET_NAME}' is not accessible`);
      }
    } catch (error) {
      console.error('TaskMediaService.validateBucket - Bucket validation failed:', error);
      throw createPhotoUploadError(
        PhotoUploadErrorCodes.UPLOAD_FAILED,
        `Storage bucket '${this.BUCKET_NAME}' is not available. Please check configuration.`,
        error
      );
    }
  }

  /**
   * Generate a unique filename with proper extension
   */
  private static generateFileName(file: File): string {
    // Extract the correct extension from the file type
    let fileExt = 'jpg'; // Default fallback
    
    if (file.type === 'image/webp') {
      fileExt = 'webp';
    } else if (file.type === 'image/png') {
      fileExt = 'png';
    } else if (file.type === 'image/jpeg') {
      fileExt = 'jpg';
    } else if (file.type === 'image/gif') {
      fileExt = 'gif';
    } else {
      // Try to get extension from filename as fallback
      const nameExt = file.name.split('.').pop()?.toLowerCase();
      if (nameExt && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(nameExt)) {
        fileExt = nameExt === 'jpeg' ? 'jpg' : nameExt;
      }
    }

    return `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  }

  /**
   * Upload a photo for a task with enhanced validation and error handling
   */
  static async uploadPhoto(file: File): Promise<ApiResponse<string>> {
    console.log('TaskMediaService.uploadPhoto - Starting upload');
    console.log('TaskMediaService.uploadPhoto - File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    });

    return apiRequest('tasks.uploadPhoto', async () => {
      // Validate the file before processing
      const validation = validatePhotoFile(file);
      if (!validation.valid && validation.error) {
        console.error('TaskMediaService.uploadPhoto - File validation failed:', validation.error);
        throw validation.error;
      }

      // Validate bucket availability
      await this.validateBucket();

      // Generate unique filename
      const fileName = this.generateFileName(file);
      
      console.log('TaskMediaService.uploadPhoto - Generated filename:', fileName);
      console.log('TaskMediaService.uploadPhoto - Determined extension from type:', file.type);

      // Upload to storage
      const response = await StorageService.uploadFile(this.BUCKET_NAME, fileName, file);
      
      if (!response.success) {
        console.error('TaskMediaService.uploadPhoto - Upload failed:', response.error);
        throw createPhotoUploadError(
          PhotoUploadErrorCodes.UPLOAD_FAILED,
          response.error?.message || 'Failed to upload photo to storage',
          response.error
        );
      }

      console.log('TaskMediaService.uploadPhoto - Upload successful:', response.data);
      return response.data;
    });
  }

  /**
   * Delete a task photo with improved error handling
   */
  static async deletePhoto(photoUrl: string): Promise<ApiResponse<void>> {
    return apiRequest('tasks.deletePhoto', async () => {
      console.log('TaskMediaService.deletePhoto - Deleting photo:', photoUrl);

      // Extract path from URL
      const urlParts = photoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      if (!fileName) {
        throw createPhotoUploadError(
          PhotoUploadErrorCodes.VALIDATION_FAILED,
          'Invalid photo URL format - cannot extract filename',
          { photoUrl }
        );
      }

      console.log('TaskMediaService.deletePhoto - Extracted filename:', fileName);

      const response = await StorageService.deleteFile(this.BUCKET_NAME, fileName);
      if (!response.success) {
        console.error('TaskMediaService.deletePhoto - Delete failed:', response.error);
        throw createPhotoUploadError(
          PhotoUploadErrorCodes.UPLOAD_FAILED,
          response.error?.message || 'Failed to delete photo from storage',
          response.error
        );
      }

      console.log('TaskMediaService.deletePhoto - Delete successful');
    });
  }
}
