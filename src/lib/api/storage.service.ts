/**
 * Storage Service
 * 
 * Provides file storage operations abstracted from Supabase.
 */

import { apiRequest } from './error-handling';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from '@/types/shared';

/**
 * Storage utilities abstracted from Supabase
 */
export class StorageService {
  /**
   * Upload a file to storage
   */
  static async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<ApiResponse<string>> {
    return apiRequest(`storage.upload.${bucket}`, async () => {
      console.log('StorageService.uploadFile - Uploading to bucket:', bucket, 'path:', path);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
        });

      if (error) {
        console.error('StorageService.uploadFile - Upload error:', error);
        throw error;
      }
      
      if (!data?.path) {
        console.error('StorageService.uploadFile - No path returned from upload');
        throw new Error('Upload failed - no path returned');
      }

      console.log('StorageService.uploadFile - Upload successful, path:', data.path);

      // Return the full URL
      const publicUrl = StorageService.getPublicUrl(bucket, data.path);
      console.log('StorageService.uploadFile - Public URL:', publicUrl);
      
      return publicUrl;
    });
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(
    bucket: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return apiRequest(`storage.delete.${bucket}`, async () => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    });
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}
