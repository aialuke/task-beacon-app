
import { useState, useCallback } from "react";
import { toast } from "@/lib/toast";
import { compressAndResizePhoto } from "@/lib/imageUtils";
import { uploadTaskPhoto } from "@/integrations/supabase/api/tasks.api";

export interface PhotoUploadState {
  photo: File | null;
  photoPreview: string | null;
  isUploading: boolean;
}

/**
 * Hook for handling photo upload functionality
 * 
 * Provides photo selection, preview, compression, and upload logic
 * that can be reused across different forms
 * 
 * @returns Photo state and handlers
 */
export function usePhotoUpload() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handles photo file input changes
   * Creates a preview and processes the photo for upload
   */
  const handlePhotoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = e.target.files?.[0];
    
    if (!file) {
      setIsUploading(false);
      return;
    }

    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    
    try {
      const processedFile = await compressAndResizePhoto(file);
      setPhoto(processedFile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred while processing the image.");
      }
      
      // Clear preview on error
      setPhotoPreview(null);
      setPhoto(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Uploads the selected photo using the API layer
   * @returns URL of the uploaded photo or null if no photo
   */
  const uploadPhoto = useCallback(async (): Promise<string | null> => {
    if (!photo) return null;
    
    setIsUploading(true);
    
    try {
      const { data: photoUrl, error } = await uploadTaskPhoto(photo);
      if (error) throw error;
      return photoUrl || null;
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [photo]);

  /**
   * Clears the selected photo and preview
   */
  const clearPhoto = useCallback(() => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview(null);
  }, [photoPreview]);

  /**
   * Resets all photo-related state
   */
  const resetPhotoState = useCallback(() => {
    clearPhoto();
    setIsUploading(false);
  }, [clearPhoto]);

  return {
    photo,
    photoPreview,
    isUploading,
    handlePhotoChange,
    uploadPhoto,
    clearPhoto,
    resetPhotoState
  };
}
